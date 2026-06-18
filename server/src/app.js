const ENV = require("./config/environments/env")
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.routes");
const socialAuthRouter = require("./routes/socialauth.routes");
const accountRouter = require("./routes/accounts.routes");
const postRouter = require("./routes/post.routes");
const activityRouter = require("./routes/activity.routes");
const app = express();
const origin = ENV.CLIENT_URL
// Middlewares 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({ origin: origin}))

console.log(origin)
// Dummy Route
app.get("/", (req, res) => {
    res.send("Server is Running..")
})

// user routes
app.use("/api/auth", userRouter);
// social routes
app.use("/api/oauth", socialAuthRouter);
// account router
app.use("/api/accounts",accountRouter)
// post router
app.use("/api/posts",postRouter)
// activity router
app.use("/api/activity",activityRouter)

module.exports = app;