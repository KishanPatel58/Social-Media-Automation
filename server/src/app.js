const ENV = require("./config/environments/env")
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.routes");
const socialAuthRouter = require("./routes/socialauth.routes");
const app = express();

// Middlewares 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({ origin: ENV.CLIENT_URL }))

// Dummy Route
app.get("/", (req, res) => {
    res.send("Server is Running..")
})

// user routes
app.use("/api/auth", userRouter);
// social routes
app.use("/api/oauth", socialAuthRouter);

module.exports = app;