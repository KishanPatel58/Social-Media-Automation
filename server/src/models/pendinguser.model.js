const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    otp: {
        type: String,
        default: ""
    },
    otpExpireAt: {
        type: Date,
        default: null
    }
}, {timestamps: true})

const pendingUserModel = mongoose.model("PendingUser", pendingUserSchema);

module.exports = pendingUserModel