const AWS = require('aws-sdk');

const tableName = process.env.GENERATEUSER_TABLE_NAME

async function getUser(username) {

	const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

	var params = {
		TableName: tableName,
		Key:{
			'userId': username
		},
	  };
	
	  const result = await docClient.get(params).promise();
	  
	  const response = {
		"isBase64Encoded": false,
		"statusCode": 200,
		"headers": {},
		"body": result,
	  };

	  return response
	
  }
  
  module.exports = {
	getUser,
  };
  