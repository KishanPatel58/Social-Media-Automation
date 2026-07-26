const ENV = require("../config/environments/env");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const protect = async (req, res, next) => {
    try {
        console.log("1. Middleware started");
        const accessToken = req.cookies.token;
        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Please login first."
            });
        }

        try {
            console.log("3. Verifying access token");
            // Access token is valid
            const decoded = jwt.verify(accessToken, ENV.JWT_ACCESS_SECRET);
            console.log("4. Access token valid");
            const user = await userModel.findById(decoded.user._id);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found."
                });
            }
            console.log("5. User found");
            req.user = user;
            return next();

        } catch (err) {
            // Access token expired
            console.log("6.", err.name);
            if (err.name !== "TokenExpiredError") {
                console.log("7. Invalid token");
                return res.status(401).json({
                    success: false,
                    message: "Invalid access token."
                });
            }
            console.log("8. Token expired");
            // Decode expired token to get user id
            const decoded = jwt.decode(accessToken);
            console.log("9.", decoded);
            const user = await userModel.findById(decoded.user._id);
            console.log("10. User:", user?.email);

            console.log("11. Refresh token:", !!user.refreshToken);

            console.log("12. Expire At:", user.refreshTokenExpireAt);
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
            console.log("13. Refresh verified");
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
            console.log("14. New access token created");
            res.cookie("token", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000
            });

            console.log("15. Cookie sent");
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