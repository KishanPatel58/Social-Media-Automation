const mongoose = require("mongoose");
const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    platform: {
        type: String,
        enum: ["twitter", "linkedin", "instagram", "facebook", "facebook_page", "linkedin_page", "instagram_business"],
        required: true
    },
    handle: {
        type: String,
        required: true
    },
    zernioAccountId: {
        type: String
    },
    accessToken: {
        type: String
    },
    refreshToken: {
        type: String
    },
    tokenExpiresAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ["connected", "disconnected"],
        default: "connected"
    },
    avatarUrl: {
        type: String
    },
    followers: {
        type: Number,
        default: 0
    },
    following: {
        type: Number,
        default: 0
    }
}, { timestamps: true })
const accountModel = mongoose.model("account", accountSchema);
module.exports = accountModel;