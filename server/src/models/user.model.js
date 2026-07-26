const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
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
    zernioProfileId: {
        type: String
    },
    avatar: {
        type: String,
        default: ""
    },
    otp: {
        type: String,
        default: ""
    },
    otpExpireAt: {
        type: Date,
        default: null
    },
    refreshToken: {
        type: String,
        default: null
    },
    refreshTokenExpireAt: {
        type: Date,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;