const ENV = require("../config/environments/env")
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const uploadImage = require("../services/uploadImage.service");
const pendingUserModel = require("../models/pendinguser.model");
const sendEmail = require("../config/email/email.config");
const generateAccessToken = ({ id, name, email, avatar }) => {
    const token = jwt.sign({
        user: {
            _id: id,
            name: name,
            email: email,
            avatar: avatar
        }
    }, ENV.JWT_ACCESS_SECRET, { expiresIn: '15m' })
    return token
}
const generateRefreshToken = ({ id }) => {
    const token = jwt.sign({ _id: id }, ENV.JWT_REFRESH_SECRET, { expiresIn: '30d' })
    return token
}
const generateStrongOtp = () => {
    return crypto.randomInt(100000, 999999);
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(401).json({
                success: false,
                message: "All Fields are required."
            })
        }
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(401).json({
                success: false,
                message: "User already exists with this email."
            })
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const otp = String(generateStrongOtp());
        const newUser = await pendingUserModel.create({
            name: name,
            email: email,
            password: hashedPassword,
            otp: otp,
            otpExpireAt: new Date(Date.now() + 15 * 60 * 1000)
        });
        const html = `
            <h4>Verify Your Email. <br>Use Code:</h4>
            <h5>${otp}</h5><br>
            <p>to verify your email.</p>
        `
        const response = sendEmail({
            toemail: email,
            text: `Welcome, ${newUser.name} please verify your email id.`,
            subject: "Verify Email!",
            html: html
        })
        return res.status(201).json({
            success: true,
            message: `Hey, ${newUser.name} please Verify your email.`
        })
    } catch (error) {
        return res.status(500).json({ message: `Error: ${error.message}` || "Internal Server Error." })
    }
}

const verifyOtpAndCreateUser = async (req, res) => {
    try {
        const {otp,email} = req.body;
        const user = await pendingUserModel.findOne({email}).select("+password");
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not exists."
            })
        }
        if(new Date() > user.otpExpireAt){
            return res.status(401).json({
                success: false,
                message: "Otp Already Expired!"
            })
        }
        if(otp !== user.otp){
            return res.status(401).json({
                success: false,
                message: "Invalid Otp!"
            })
        }
        const newUser = await userModel.create({
            name: user.name,
            email: user.email,
            password: user.password,
            isVerified: true
        })
        const refreshToken = generateRefreshToken({
            id: newUser._id
        })
        const accessToken = generateAccessToken({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar
        })
        newUser.refreshToken = refreshToken
        newUser.refreshTokenExpireAt = Date.now() + (30 * 24 * 60 * 60 * 1000);
        await newUser.save();
        await pendingUserModel.deleteOne({ _id: user._id });
        res.cookie("token", accessToken, {
            secure: ENV.PRODUCT_ON === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'lax'
        })
        return res.status(201).json({
            success: true,
            message: `Welcome, ${newUser.name}`,
            user: {
                name: newUser.name,
                email: newUser.email,
                avatar: newUser.avatar
            }
        })
    } catch (error) {
        return res.status(500).json({ message: `Error: ${error.message}` || "Internal Server Error." })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(401).json({
                success: false,
                message: "All Fields are required."
            })
        }
        const user = await userModel.findOne({email}).select("+password");
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password."
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password."
            })
        }
        const refreshToken = generateRefreshToken({
            id: user._id
        })
        user.refreshToken = refreshToken
        user.refreshTokenExpireAt = Date.now() + (30 * 24 * 60 * 60 * 1000);
        await user.save();
        const accessToken = generateAccessToken({
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        })
        res.cookie("token", accessToken, {
            secure: ENV.PRODUCT_ON === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'lax'
        })
        return res.status(200).json({
            success: true,
            message: `Welcome, ${user.name}`,
            user: {
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        })
    } catch (error) {
        return res.status(500).json({ message: `Error: ${error.message}` })
    }
}

const changeUsername = async (req, res) => {
    try {
        const { uname } = req.body;
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        user.name = uname;
        const refreshToken = generateRefreshToken({
            id: user._id
        })
        user.refreshToken = refreshToken
        user.refreshTokenExpireAt = Date.now() + (30 * 24 * 60 * 60 * 1000);
        await user.save();
        const accessToken = generateAccessToken({
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        })
        res.cookie("token", accessToken, {
            secure: ENV.PRODUCT_ON === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'lax'
        })
        return res.status(200).json({
            success: true,
            message: "Username Changed Successfully.",
            user: {
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        })
    } catch (error) {
        return res.status(500).json({ message: `Error: ${error.message}` })
    }
}

const uploadProfile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded.",
            });
        }

        const user = await userModel.findById(req.user.id);

        const imageUrl = await uploadImage({
            file: req.file.path,
            filename: req.file.originalname,
        });

        user.avatar = imageUrl;
        const refreshToken = generateRefreshToken({
            id: user._id
        })
        user.refreshToken = refreshToken
        user.refreshTokenExpireAt = Date.now() + (30 * 24 * 60 * 60 * 1000);
        await user.save();
        const accessToken = generateAccessToken({
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        })
        res.cookie("token", accessToken, {
            secure: ENV.PRODUCT_ON === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'lax'
        })
        return res.status(200).json({
            success: true,
            message: "Profile uploaded successfully.",
            user: {
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error."
        });
    }
};

const loginInstagram = async (req, res) => {
    try {
        const APP_ID = process.env.APP_ID;
        const REDIRECT = process.env.REDIRECT_URI;
        const scope = [
            "instagram_basic",
            "pages_show_list",
            "pages_read_engagement",
            "instagram_manage_insights",
            "business_management"
        ].join(",");
        const url =
            `https://www.facebook.com/v23.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${REDIRECT}&scope=${scope}`;

        res.redirect(url);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error.",
        });
    }
}

const resendOtp = async (req,res) => {
    try {
        const {email} = req.body;
        if(!email){
            return res.status(401).json({
                success: false,
                message: "Email can't find for resend otp."
            })
        }
        const otp = String(generateStrongOtp());
        const user = await pendingUserModel.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Can't find User."
            })
        }
        user.otp = otp;
        user.otpExpireAt = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();
        const html = `
            <h4>Verify Your Email. <br>Use Code:</h4>
            <h5>${otp}</h5><br>
            <p>to verify your email.</p>
        `
        const response = sendEmail({
            toemail: email,
            text: `Welcome, ${user.name} please verify your email id.`,
            subject: "Verify Email!",
            html: html
        })
        return res.status(200).json({
            success: true,
            message: "Verification Code Send to Your Email."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error.",
        });
    }
}

const logoutUser = async (req,res) => {
    try {
        res.clearCookie("token",{
            secure: ENV.PRODUCT_ON === "production"
        })
        return res.status(200).json({
            success: true,
            message: "User Logout Successfully."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error.",
        });
    }
}
module.exports = {
    registerUser,
    loginUser,
    changeUsername,
    uploadProfile,
    loginInstagram,
    verifyOtpAndCreateUser,
    resendOtp,
    logoutUser
}