const mongoose = require("mongoose");
const env = require("../environments/env");
const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGODB_URL)
    } catch (error) {
        throw new Error(`DB ERROR: ${error.message}`)
    }
}
module.exports = connectDB;