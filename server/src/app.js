const express = require("express");
const app = express();

// Middlewares 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Dummy Route
app.get("/", (req,res)=>{
    res.send("Server is Running..")
})
module.exports = app;