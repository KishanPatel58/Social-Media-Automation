const env = require("./src/config/environments/env");
const express = require("express");
const server = require("./src/app");
const connectDB = require("./src/config/database/db");
const { initScheduler } = require("./src/services/schedule.service");
const PORT = env.PORT;

const startServer = async () => {
  try {
    server.listen(PORT, () => console.log(`Server is Running on PORT: ${PORT}`));
    await connectDB();
    initScheduler();
  } catch (error) {
    console.error(error);
  }
};

startServer();