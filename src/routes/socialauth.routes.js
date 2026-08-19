const express = require("express");
const { generateAuthUrl, syncAccounts } = require("../controllers/socialAuth.controller");
const { protect } = require("../middlewares/auth.middleware");
const socialAuthRouter = express.Router();
socialAuthRouter.get("/:platform/url",protect,generateAuthUrl)
socialAuthRouter.get("/sync",protect,syncAccounts)
module.exports = socialAuthRouter;