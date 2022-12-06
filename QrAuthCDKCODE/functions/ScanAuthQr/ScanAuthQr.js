const AWS = require('aws-sdk')
const lambda = new AWS.Lambda({ region: "eu-west-2" })

const sendDataToAuthenticationLambda = async (event) => {
    return await new Promise((resove, reject) => {
        const params = {
            FunctionName: 'QRAuth-AuthenticateUser',
            Payload: JSON.stringify(event)
        }

        lambda.invoke(params, (err, results) => {
            if(err) reject(err)
            else resove(results)
        })
    })
}

exports.ScanQrLamda = async (event) => {
 console.log("the event being passed is:", event)
 return sendDataToAuthenticationLambda(event)
};
