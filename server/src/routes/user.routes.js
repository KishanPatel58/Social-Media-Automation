const express = require("express");
const { registerUser, loginUser, changeUsername, uploadProfile, loginInstagram, verifyOtpAndCreateUser, resendOtp, logoutUser, forgotPassword, verifyForgotOtp, resetPassword, resendForgotOtp } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logoutUser);
userRouter.post("/verifyemailandcreateuser", verifyOtpAndCreateUser);
userRouter.post("/resendOtpverifyemail", resendOtp);
userRouter.post("/changeusername", protect, changeUsername);
userRouter.post("/changeprofile",protect,upload.single("media"),uploadProfile)
userRouter.get("/instagram/login",loginInstagram)

userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/verify-forgot-otp", verifyForgotOtp);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/resend-forgot-otp", resendForgotOtp);

module.exports = userRouter;