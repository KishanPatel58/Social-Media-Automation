const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    mediaUrl: {
        type: String
    },
    mediaType: {
        type: String,
        enum: ['image', 'video']
    },
    platforms: [{
        type: String,
        enum: ["linkedin", "instagram", "linkedin_page", "instagram_business"]
    }],
    scheduledFor: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["draft","scheduled","published","failed"],
        default: "scheduled"
    }
}, {timestamps: true});
const postModel = mongoose.model("post",postSchema);
module.exports = postModel;