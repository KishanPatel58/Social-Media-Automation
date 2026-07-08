const express = require("express");
const { registerUser, loginUser, changeUsername, uploadProfile, loginInstagram } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/changeusername", protect, changeUsername);
userRouter.post("/changeprofile",protect,upload.single("media"),uploadProfile)
userRouter.get("/instagram/login",loginInstagram)
module.exports = userRouter;