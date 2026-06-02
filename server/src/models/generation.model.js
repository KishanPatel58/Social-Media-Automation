const mongoose = require('mongoose');
const generationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    prompt: {
        type: String,
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
        enum: ['image', 'video', 'audio']
    },
    tone: {
        type: String
    }
}, { timestamps: true });
const generationModel = mongoose.model("generation",generationSchema);
module.exports = generationModel;