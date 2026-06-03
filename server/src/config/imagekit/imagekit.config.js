const ImageKit = require("@imagekit/nodejs");
const ENV = require("../environments/env");

const imageKit = ImageKit({
    privatekey: ENV.IMAGEKIT_PRIVATE_KEY,
    publickey: ENV.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: ENV.IMAGEKIT_URL_END_POINT
})

module.exports = imageKit;