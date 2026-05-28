const env = require("./src/config/environments/env");
const express = require("express");
const server = require("./src/app");
const connectDB = require("./src/config/database/db");
const PORT = env.PORT;

connectDB()

server.listen(PORT, ()=>console.log(`Server is Running on PORT: ${PORT}`))