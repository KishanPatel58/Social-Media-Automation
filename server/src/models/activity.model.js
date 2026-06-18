const mongoose = require("mongoose");
const { type } = require("node:os");

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    actionType: {
        type: String,
        enum: ["POST_PUBLISHED", "AI_REPLY"],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    relatedPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    },
    platform: {
        type: String
    },
    aiGeneratedText: {
        type: String
    }
}, { timestamps: true });

const activityModel = mongoose.model("activity",activitySchema);

module.exports = activityModel