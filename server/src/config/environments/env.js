require("dotenv").config({ quiet: true });

module.exports = {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    CLIENT_URL: process.env.CLIENT_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    PRODUCT_ON: process.env.PRODUCT_ON,
    ZERNIO_API_KEY: process.env.ZERNIO_API_KEY,
    ZERNIO_BASE_URL: process.env.ZERNIO_BASE_URL,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    HUGGING_FACE_TOKEN: process.env.HUGGING_FACE_TOKEN,
    GEMINI_MODEL: process.env.GEMINI_MODEL
}