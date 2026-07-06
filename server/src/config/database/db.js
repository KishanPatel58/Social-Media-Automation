const mongoose = require("mongoose");
const env = require("../environments/env");
const PRODUCT_ON = process.env.PRODUCT_ON;
const connectDB = async () => {
    let url = PRODUCT_ON==="development"?"mongodb://localhost:27017/socialschedulerfsd":env.MONGODB_URL
    try {
        await mongoose.connect(url)
        console.log("MongoDB Connected.")
    } catch (error) {
        throw new Error(`DB ERROR: ${error.message}`)
    }
}
module.exports = connectDB;