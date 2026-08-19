const ENV = require("../environments/env")
const {Zernio} = require("@zernio/node");
const zernio = new Zernio({
    apiKey: ENV.ZERNIO_API_KEY,
    baseURL: ENV.ZERNIO_BASE_URL
});
module.exports = zernio;