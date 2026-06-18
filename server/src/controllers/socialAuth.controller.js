const zernio = require("../config/zernio/zernio");
const accountModel = require("../models/account.model");
const userModel = require("../models/user.model");

// check user have must have zernio profile
const getOrCreateZernioProfile = async (user) => {
    try {
        const result = await zernio.profiles.listProfiles();
        const data = result.data;
        const profiles = Array.isArray(data) ? data : data?.profiles || data?.data || [];
        if (profiles.length > 0) {
            const pid = profiles[0]._id || profiles[0].id;
            await userModel.findByIdAndUpdate(user._id, { zernioProfileId: pid });
            return pid;
        }
        const createResult = await zernio.profiles.createProfile({
            body: {
                name: `${user.name || user.email}'s workspace`
            }
        })
        const created = (createResult.data)?.profile || createResult.data;
        const pid = created?._id || created?.id
        if (!pid) {
            throw new Error("Fail to Create Zernio Profile.")
        }
        await userModel.findByIdAndUpdate(user._id, { zernioProfileId: pid });
        return pid;
    } catch (error) {
        return res.status(500).json({
            message: `Error: ${error.message}`
        })
    }
}

// Generate Oauth authorization url
// Endpoint /api/auth/:platform
const generateAuthUrl = async (req, res) => {
    try {
        const { platform } = req.params;
        const profileId = await getOrCreateZernioProfile(req.user);
        const origin = req.headers.origin;
        const redirectUrl = `${origin}/accounts`;
        const result = await zernio.connect.getConnectUrl({
            path: { platform: platform },
            query: { profileId, redirect_url: redirectUrl }
        })
        const data = result.data;
        
        const authUrl = data.authUrl;
        if (!authUrl) {
            throw new Error(`Zernio returned no authUrl. Full response: ${JSON.stringify(data)}`)
        }
        res.status(201).json({ url: authUrl })
    } catch (error) {
        return res.status(500).json({
            message: `Error: ${error.message}`
        })
    }
}

// Sync connected accounts from zernio into MongoDB
// Endpoint GET /api/auth/sync
const syncAccounts = async (req, res) => {
    try {
        const profileId = await getOrCreateZernioProfile(req.user);
        const result = await zernio.accounts.listAccounts({
            query: {
                profileId
            }
        })
        const data = result.data;
        const zernioAccounts = data?.accounts || (Array.isArray(data) ? data : []);
        const supportedPlatforms = ["twitter", "linkedin", "instagram", "facebook"];
        const syncedAccounts = [];
        for (const zAccount of zernioAccounts) {
            const zid = zAccount._id || zAccount.id;
            if (!zid) {
                console.warn("Skipping account with no ID:", zAccount);
                continue;
            }
            const rawPlatform = (zAccount.platform || zAccount.type || "").toLowerCase();
            const normalizedPlatform = supportedPlatforms.find(p => rawPlatform.includes(p));
            if (!normalizedPlatform) {
                console.warn("Skipping unsupported platform account:", rawPlatform);
                continue;
            }
            const account = await accountModel.findOneAndUpdate({ zernioAccountId: zid }, { user: req.user._id, platform: normalizedPlatform, handle: zAccount.username || zAccount.name || zAccount.handle || "Unknown", zernioAccountId: zid, status: "connected", avatarUrl: zAccount.avatarUrl || zAccount.picture || zAccount.profile_image_url }, { upsert: true , returnDocument: 'after'})
            syncedAccounts.push(account);
        }
        res.status(200).json({message: "Account Sync now.",syncAccounts})
    } catch (error) {
        return res.status(500).json({
            message: `Error: ${error.message}`
        })
    }
}

module.exports = {
    syncAccounts,
    generateAuthUrl,
    getOrCreateZernioProfile
}