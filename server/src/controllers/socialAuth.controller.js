const zernio = require("../config/zernio/zernio");
const accountModel = require("../models/account.model");
const userModel = require("../models/user.model");

// check user have must have zernio profile
const getOrCreateZernioProfile = async (user) => {
    try {

        // If the user already has a Zernio profile, use it.
        if (user.zernioProfileId) {
            return user.zernioProfileId;
        }

        // Otherwise create a new profile.
        const createResult = await zernio.profiles.createProfile({
            body: {
                name: `workspace-${user._id}`
            }
        });

        const created = createResult.data?.profile || createResult.data;

        const pid = created?._id || created?.id;

        if (!pid) {
            throw new Error("Failed to create Zernio profile.");
        }

        user.zernioProfileId = pid;
        await user.save();

        return pid;

    } catch (error) {
        throw error;
    }
};

// Generate Oauth authorization url
// Endpoint /api/auth/:platform
const generateAuthUrl = async (req, res) => {
    try {
        const { platform } = req.params;
        const profileId = await getOrCreateZernioProfile(req.user);
        const origin = req.headers.origin;
        const redirectUrl = `${origin}/accounts?sync=true`;
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
        console.log("================================");
        console.log("Current User:", req.user.email);
        console.log("Profile ID:", profileId);
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
            const account = await accountModel.findOneAndUpdate(
                {
                    user: req.user._id,
                    zernioAccountId: zid
                },
                {
                    platform: normalizedPlatform,
                    handle: zAccount.username || zAccount.name || zAccount.handle || "Unknown",
                    zernioAccountId: zid,
                    status: "connected",
                    avatarUrl: zAccount.avatarUrl || zAccount.picture || zAccount.profile_image_url
                },
                {
                    upsert: true,
                    new: true
                }
            );
            syncedAccounts.push(account);
        }
        res.status(200).json({ message: "Account Sync now.", syncAccounts })
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