const AWS = require('aws-sdk')
const lambda = new AWS.Lambda({ region: "eu-west-2" })

const sendDataToConnectionLambda = async (event) => {
    return await new Promise((resove, reject) => {
        const params = {
            FunctionName: 'QRAuth-AddConnection',
            Payload: JSON.stringify(event.body)
        }

        lambda.invoke(params, (err, results) => {
            if(err) reject(err)
            else resove(results)
        })
    })
}

exports.ScanConnetionQrLamda = async (event) => {
 console.log("the event being passed is:", event)
 console.log(event.body)
 return sendDataToConnectionLambda(event)
};
