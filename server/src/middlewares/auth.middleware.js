const ENV = require("../config/environments/env")
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const protect = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token,ENV.JWT_SECRET);
            req.user = await userModel.findById(decoded.id);
            next()
        } catch (error) {
            return res.status(500).json({
                message: `Error: ${error.message}`
            })
        }
    }
}

module.exports = {
    protect
}