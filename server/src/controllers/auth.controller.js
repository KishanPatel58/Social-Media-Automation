const ENV = require("../config/environments/env")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model")

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
        res.cookie("token", token, {
            secure: ENV.PRODUCT_ON === "production",
            samesite: 'lax'
        })
        res.status(201).json({
            message: "User Registered Successfully.",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })
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
        let user = await userModel.findOne({email}).select("+password");
        if(!user){
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }
        const isMatch = await comparePassword(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }
        const token = generateToken(user._id);
        res.cookie("token", token, {
            secure: ENV.PRODUCT_ON === "production",
            samesite: 'lax'
        })
        return res.status(200).json({
            message: "User Loggedin Successfully.",
            user:{
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        return res.status(500).json({ message: `Error: ${error.message}` })
    }
}

module.exports = {
    registerUser,
    loginUser
}