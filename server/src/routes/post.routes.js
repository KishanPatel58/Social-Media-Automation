const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { getPosts, getGenerations, schedulePost, generatePost } = require("../controllers/post.controller");
const upload = require("../middlewares/upload.middleware");
const postRouter = express.Router();
postRouter.get("/",protect,getPosts)
postRouter.get("/generations",protect,getGenerations)
postRouter.post("/",protect,upload.single("media"),schedulePost)
postRouter.post("/generate",protect,generatePost)
module.exports = postRouter;