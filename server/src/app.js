const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

// Middlewares 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Dummy Route
app.get("/", (req,res)=>{
    res.send("Server is Running..")
})

module.exports = app;