// Get all Activity

const activityModel = require("../models/activity.model");

// GET /api/activity
const getActivity = async (req, res) => {
    try {
        const activity = await activityModel.find({user:req.user._id}).sort({createdAt: -1}).limit(10).populate("relatedPost","content")
        res.status(200).json(activity)
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error."})
    }
}

module.exports = {
    getActivity,
}