const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { getAccounts, addAccount, deleteAccount } = require("../controllers/account.controller");
const accountRouter = express.Router();
accountRouter.get("/",protect,getAccounts)
accountRouter.post("/",protect,addAccount)
accountRouter.delete("/:id",protect,deleteAccount)
module.exports = accountRouter;