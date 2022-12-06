const toDataURL = require("qrcode");
const { v4: uuidv4 } = require("uuid");

exports.ConnectionQrLambda = async(event) => {

  const id = uuidv4();

  const QrGenerator = async (id) => {
    try {
      const qr = await toDataURL(id);
      return qr;
    } catch (err) {
      console.log(err);
    }
  };

  const qr = await QrGenerator(id);

  const response = {
    "isBase64Encoded": false,
    "statusCode": 200,
    "headers": {},
    "body": JSON.stringify({"QR_URI": qr})
  };

  return response;
}
