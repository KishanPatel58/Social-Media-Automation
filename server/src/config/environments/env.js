require("dotenv").config({quiet: true});

module.exports = {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL
}