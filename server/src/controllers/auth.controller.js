const ENV = require("../config/environments/env")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const uploadImage = require("../services/uploadImage.service");

// methods
const generateToken = (userId) => {
    const token = jwt.sign({ userId }, ENV.JWT_SECRET, { expiresIn: "30d" })
    return token;
}
const comparePassword = async (inputpassword, actualpassword) => {
    const isMatch = await bcrypt.compare(inputpassword, actualpassword);
    return isMatch;
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required."
            })
        }
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists."
            })
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await userModel.create({
            name, email, password: hashedPassword
        })
        const token = generateToken(newUser._id);

        res.status(201).json({
            message: "User Registered Successfully.",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                avatar: newUser.avatar
            }
        });
    } catch (error) {
        return res.status(500).json({ message: `Error: ${error.message}` })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required."
            })
        }
        let user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }
        const token = generateToken(user._id);
        return res.status(200).json({
            message: "User Loggedin Successfully.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
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
        await user.save()
        const token = generateToken(userId)
        return res.status(200).json({
            success: true,
            message: "Username Changed Successfully.",
            token,
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

        await user.save();

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
        console.log(error);

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

module.exports = {
    registerUser,
    loginUser,
    changeUsername,
    uploadProfile,
    loginInstagram
}