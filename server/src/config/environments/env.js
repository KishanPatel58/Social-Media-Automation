require("dotenv").config({quiet: true});

module.exports = {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    CLIENT_URL: process.env.CLIENT_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    PRODUCT_ON: process.env.PRODUCT_ON,
    ZERNIO_API_KEY: process.env.ZERNIO_API_KEY,
    ZERNIO_BASE_URL: process.env.ZERNIO_BASE_URL
}