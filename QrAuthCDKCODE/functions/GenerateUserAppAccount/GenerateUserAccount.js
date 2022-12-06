// import { DocumentClient } from "aws-sdk/clients/dynamodb";
// const docClient = new DocumentClient();
const tableName = process.env.GENERATEUSER_TABLE_NAME;
const {v4:uuidv4} = require('uuid')
const AWS = require('aws-sdk');
AWS.config.update({region: "eu-west-2"})

exports.createAccountIdLambda = async(event, context) => {

  const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

 var id = uuidv4();
  console.log(id);

  var params = {
    TableName: tableName,
    Item: { userId: id },
  };

  const result = await documentClient.put(params).promise();

  const response = {
    "isBase64Encoded": false,
    "statusCode": 200,
    "headers": {},
    "body": JSON.stringify(result),
  };

  return response;
}
