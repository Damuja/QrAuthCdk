const axios = require("axios");

const withMFA = function (req, res, next) {
  axios
    .get("https://6fv7id7el6.execute-api.eu-west-2.amazonaws.com/prod/qr")
    .then(function (response) {
      req.body["QR_URI"] = response.data.QR_URI;
      next();
    })
    .catch(function (err) {
      console.log("Error:", err);
    });
};

module.exports = withMFA;
