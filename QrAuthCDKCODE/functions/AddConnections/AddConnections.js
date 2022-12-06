const aws = require("aws-sdk");
var DB = new aws.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require("uuid");
const tableName = process.env.GENERATEUSER_TABLE_NAME;

async function appendConnections(userId, childInfo) {
  return DB.update({
    TableName: tableName,
    Key: { userId: userId },
    ReturnValues: "ALL_NEW",
    UpdateExpression:
      "set #Connections = list_append(if_not_exists(#Connections, :empty_list), :childInfo)",
    ExpressionAttributeNames: {
      "#Connections": "Connections",
    },
    ExpressionAttributeValues: {
      ":childInfo": [childInfo],
      ":empty_list": [],
    },
  }).promise();
}


async function appendCurrSessionKey(userId, childInfo) {
  return DB.update({
    TableName: tableName,
    Key: { userId: userId },
    ReturnValues: "ALL_NEW",
    UpdateExpression:
      "set #CurrSessionKey = list_append(if_not_exists(#CurrSessionKey, :empty_list), :childInfo)",
    ExpressionAttributeNames: {
      "#CurrSessionKey": "CurrSessionKey",
    },
    ExpressionAttributeValues: {
      ":childInfo": [childInfo],
      ":empty_list": [],
    },
  }).promise();
}

exports.AddConnectionsLambda = async(event) => { //event is recieving the users id and the connection key from the phoneapp lambda (ScanConnectionQr)
  var body = JSON.parse(event);

  console.log("TESTING:", body);
  console.log("event.Website = ", body.Website)
 
 try{
   await appendConnections( body.userId, {
    Website: body.Website, //not implimented yet
    ConnectionKey: body.ConnectionKey, 
    SecretKey: uuidv4(), //this key is now generated in this lambda and saved alongside data recieved from other lambda
  })
    .then(console.log)
    .catch(console.log);    
    console.log("event.body.userId = ",event.body.userId)
 }catch(err){
   console.log(err)
   
 }
 
 try{
   await appendCurrSessionKey( body.userId, {
    Website: body.Website,
    CurrSessionKey: "" 
  })
    .then(console.log)
    .catch(console.log);    
    console.log("event.body.userId = ",event.body.userId)
 }catch(err){
   console.log(err)
   
 }

  
    
    
  const response = {
    "isBase64Encoded": false,
    "statusCode": 200,
    "headers": {},
    "body": JSON.stringify("successfully added!")
  };
  return response;
}

