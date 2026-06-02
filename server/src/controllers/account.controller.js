// Get all accounts.

const zernio = require("../config/zernio/zernio");
const accountModel = require("../models/account.model");

// Endpoint GET /api/accounts
const getAccounts = async (req, res) => {
    try {
        const accounts = await accountModel.find({ user: req.user._id });
        res.status(200).json(accounts)
    } catch (error) {
        return res.status(500).json({ message: `Error: ${error.message}` })
    }
}

// Add account
// Endpoint POST /api/accounts
const addAccount = async (req, res) => {
    try {
        const { platform, handle, avatarUrl } = req.body;
        const account = await accountModel.create({ user: req.user._id, platform, handle, avatarUrl });
        res.status(201).json(account)
    } catch (error) {
        return res.status(500).json({ message: `Error: ${error.message}` })
    }
}

// Disconnect account
// Endpoint DELETE /api/accounts/:id
const deleteAccount = async (req, res) => {
    try {
        const account = await accountModel.findOne({ _id: req.params.id, user: req.user._id });
        if (!account) {
            return res.status(400).json({ message: "Account not Found." })
        }
        if (account.zernioAccountId) {
            try {
                await zernio.accounts.deleteAccount({
                    path: {
                        accountId: account.zernioAccountId
                    }
                });
                await account.deleteOne()
                res.json({message: "Account Disconnected Successfully."})
            } catch (error) {
                return res.status(500).json({ message: `Error: ${error.message}` })
            }
        }
    } catch (error) {
        return res.status(500).json({ message: `Error: ${error.message}` })
    }
}

module.exports = {
    getAccounts,
    addAccount,
    deleteAccount
}