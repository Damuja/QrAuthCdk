const QRCode = require ('qrcode')
var Crypto = require ('crypto')
const { uuid } = require('uuidv4');
var secretKey = 'ad1fe553-23fd-4a65-9445-2e15c1283783'
var secretIV = 'smslt'
var encryptionMethod = 'AES-256-CBC'
var key = Crypto.createHash('sha512').update(secretKey, 'utf-8').digest('hex').substr(0, 32) 
var iv = Crypto.createHash('sha512').update(secretKey, 'utf-8').digest('hex').substr(0, 16) 
// const keyToEncrypt = Math.random().toString().substr(2, 8); const id = uuid();
const keyToEncrypt = "52287974"

console.log("the key being encryped: ", keyToEncrypt)


function encryptString(plainText, encryptionMethod, secret, iv){
    var encryptor = Crypto.createCipheriv(encryptionMethod, secret, iv)
    var aes_encrypted = encryptor.update(plainText, 'utf8', 'base64') + encryptor.final('base64')
    return Buffer.from(aes_encrypted).toString('base64')
}


var encryptedMessage = encryptString(keyToEncrypt, encryptionMethod, key, iv) 
console.log("the encryped version of the key: ", encryptedMessage)


function decrptString(encryptedMessage, encryptionMethod, secret, iv){
    const buff = Buffer.from(encryptedMessage, 'base64')
    encryptedMessage = buff.toString('utf-8')
    var decryptor = Crypto.createDecipheriv(encryptionMethod, secret, iv)
    return decryptor.update(encryptedMessage, 'base64', 'utf8') + decryptor.final('utf8')

}


var decryptedMessage = decrptString(encryptedMessage, encryptionMethod, key, iv) 
console.log("the key after is is decrypted: ", decryptedMessage)


const QrGenerator = async text =>{
    try{
        //const qr = await QRCode.toDataURL(text)
        //console.log("the uuid is:",id)
        const qr = await QRCode.toString(text, {type: 'terminal'})
       console.log(qr)
   }catch(err){
        console.log(err)
    }

}

QrGenerator(encryptedMessage)
