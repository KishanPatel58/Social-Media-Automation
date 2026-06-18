const env = require("./src/config/environments/env");
const express = require("express");
const server = require("./src/app");
const connectDB = require("./src/config/database/db");
const { initScheduler } = require("./src/services/schedule.service");
const PORT = env.PORT;

const startServer = async () => {
  try {
    await connectDB();

    initScheduler();

    server.listen(PORT);
  } catch (error) {
    console.error(error);
  }
};

startServer();