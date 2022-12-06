//this lambda has to first get the stuff from the qr code and decypt it using the
//decryption key from the DB then
const tableName = process.env.GENERATEUSER_TABLE_NAME;

const aws = require("aws-sdk");
const { getUser } = require("./GetUser");
const DB = new aws.DynamoDB.DocumentClient();
const Crypto = require('crypto')

function decryptString(encryptedMessage, encryptionMethod, secret, iv) {
        const buff = Buffer.from(encryptedMessage, "base64");
        encryptedMessage = buff.toString("utf-8");
        var decryptor = Crypto.createDecipheriv(encryptionMethod, secret, iv);
        return (
          decryptor.update(encryptedMessage, "base64", "utf8") +
          decryptor.final("utf8")
        );
      }
    

exports.AuthenticateUserLambda = async(event) => {
  //current user will be sent across from phone lambda to this lambda along with data from qr
  //then this function will read the users table and grab the secret key from the user
  //to then use to decrypt the qr code scanned by the phone
  console.log(event)
  let responseBody = ""
  var body = JSON.parse(event.body);
  console.log("thebody is:", body)  
  
  let encryptedMessage = body.encryptedKey
  let indexOfConnection = body.indexOfConnection
  console.log(indexOfConnection)

  var currentUserInfo = await getUser(body.userId);

  console.log("the users infromation is", currentUserInfo)
  let currentUserSecKey = currentUserInfo.body.Item.Connections[indexOfConnection].SecretKey
  let currentSessionKey = currentUserInfo.body.Item.CurrSessionKey[indexOfConnection].CurrSessionKey
  console.log("currsesshionkey:", currentUserSecKey)

  if (currentUserInfo) {
    try {

      var encryptionMethod = "AES-256-CBC";
      var key = Crypto.createHash("sha512")
        .update(currentUserSecKey, "utf-8")
        .digest("hex")
        .substr(0, 32);
      var iv = Crypto.createHash("sha512")
        .update(currentUserSecKey, "utf-8")
        .digest("hex")
        .substr(0, 16);

       

      
      var decryptedMessage = decryptString(
        encryptedMessage,
        encryptionMethod,
        key,
        iv
      ); 
      console.log("encryptedMessage", encryptedMessage)
      console.log("the key after it is decrypted: ", decryptedMessage);
     

    } catch(error){
      console.log(error)
    }
  }

  try{
    //let currSessionKey = currentUserInfo.Item.currentSessionKey
    //let currSessionKey = "78389414"
    if(decryptedMessage === currentSessionKey){
      responseBody = "Authentication successfull"
      console.log("responseBody inside of if: ",responseBody)
     return responseBody
     
    }else{
      responseBody = "ERROR CODES DO NOT MATCH"
      return responseBody
    }
  }catch(err){
    console.log("the errror is:", err)
  }

  const response = {
    "isBase64Encoded": false,
    "statusCode": 200,
    "headers": {},
    "body": JSON.stringify(responseBody),
  };
  console.log("the response is: ", response)

  return response //the response would be passing the decrypted message to the function im a make that invokes the next lambda to do the check
}
