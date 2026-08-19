const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { getActivity } = require("../controllers/activity.controller");
const activityRouter = express.Router();

activityRouter.get("/",protect,getActivity)

module.exports = activityRouter;