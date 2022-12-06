const QRCode = require("qrcode");
const Crypto = require('crypto')
const { getUser } = require("./GetUser");
const tableName = process.env.GENERATEUSER_TABLE_NAME;
const aws = require("aws-sdk");
const DB = new aws.DynamoDB.DocumentClient();

async function appendConnections(userId, childInfo, index) {
  return DB.update({
    TableName: tableName,
    Key: { userId: userId },
    ReturnValues: "ALL_NEW",
    UpdateExpression: `set #CurrSessionKey[${index}] = :childInfo`,
    ExpressionAttributeNames: {
      "#CurrSessionKey": "CurrSessionKey",
    },
    ExpressionAttributeValues: {
      ":childInfo": childInfo,
    },
  }).promise();
}

function encryptString(plainText, encryptionMethod, secret, iv) {
      var encryptor = Crypto.createCipheriv(encryptionMethod, secret, iv);
      var aes_encrypted =
        encryptor.update(plainText, "utf8", "base64") + encryptor.final("base64");
      return Buffer.from(aes_encrypted).toString("base64");
    }


exports.GenerateQrLambda = async(event) => {
  
  //var body = JSON.parse(event.body);
  console.log("event: ", event)
  console.log("event.userId,", event.userId)
  var currentUserInfo = await getUser(event.userId);
  var index = event.index
  console.log(index)
  let secretKey = currentUserInfo.body.Item.Connections[1].SecretKey
  const keyToEncrypt = Math.random().toString().substr(2, 8);

 console.log("userid   ", event.userId)
    await appendConnections( currentUserInfo.body.Item.userId, {
      Website: event.Website,
      CurrSessionKey: keyToEncrypt 
    }, index)
      .then(console.log)
      .catch(console.log);    
      console.log("event.userId = ",event.userId)
    
    
  
    if (currentUserInfo) {
      try {

      var encryptionMethod = "AES-256-CBC";
      var key = Crypto.createHash("sha512")
        .update(secretKey, "utf-8")
        .digest("hex")
        .substr(0, 32);
      var iv = Crypto.createHash("sha512")
        .update(secretKey, "utf-8")
        .digest("hex")
        .substr(0, 16);

        
        var encryptedMessage = encryptString(
          keyToEncrypt,
          encryptionMethod,
          key,
          iv
        ); 
        console.log("encryptedMessage", encryptedMessage)
        console.log("the key being encryped: ", keyToEncrypt);

      } catch(error){
        console.log(error)
      }
    }
  
   
    
    const QrGenerator = async encryptedMessage => {
      try {
        const qr = await QRCode.toDataURL(encryptedMessage);
        //const qr = await QRCode.toString(encryptedMessage)
        //const qr = await QRCode.toString(encryptedMessage, { type: 'terminal' })
        console.log("whaty is qr", qr);
          return qr
      } catch (err) {
        console.log("qrGenerator error is: ", err);
      }
        
      }
    
       const qrdata =  await QrGenerator(encryptedMessage)

  const response = {
    "isBase64Encoded": false,
    "statusCode": 200,
    "headers": {},
    "body":  JSON.stringify(qrdata)
  };
  return response;
}
