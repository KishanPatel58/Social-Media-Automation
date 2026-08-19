const ENV = require("../config/environments/env");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const protect = async (req, res, next) => {
    try {
        
        const accessToken = req.cookies.token;
        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Please login first."
            });
        }

        try {
            
            // Access token is valid
            const decoded = jwt.verify(accessToken, ENV.JWT_ACCESS_SECRET);
            
            const user = await userModel.findById(decoded.user._id);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found."
                });
            }
            
            req.user = user;
            return next();

        } catch (err) {
            // Access token expired
            
            if (err.name !== "TokenExpiredError") {
                
                return res.status(401).json({
                    success: false,
                    message: "Invalid access token."
                });
            }
            
            // Decode expired token to get user id
            const decoded = jwt.decode(accessToken);
            
            const user = await userModel.findById(decoded.user._id);
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found."
                });
            }

            // No refresh token
            if (!user.refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: "Please login again."
                });
            }

            // Refresh token expired
            if (user.refreshTokenExpireAt < Date.now()) {

                user.refreshToken = null;
                user.refreshTokenExpireAt = null;

                await user.save();

                res.clearCookie("token");

                return res.status(401).json({
                    success: false,
                    message: "Session expired. Please login again."
                });
            }

            // Verify refresh token
            jwt.verify(user.refreshToken, ENV.JWT_REFRESH_SECRET);
            
            // Generate new access token
            const newAccessToken = jwt.sign(
                {
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        profile: user.profile
                    }
                },
                ENV.JWT_ACCESS_SECRET,
                {
                    expiresIn: "15m"
                }
            );
            
            res.cookie("token", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000
            });

            req.user = user;
            
            next();
        }

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = { protect };