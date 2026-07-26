const cron = require("node-cron");
const postModel = require("../models/post.model");
const accountModel = require("../models/account.model");
const zernio = require("../config/zernio/zernio");
const activityModel = require("../models/activity.model");
const userModel = require("../models/user.model");

const initScheduler = async () => {
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date();
            const postsToPublish = await postModel.find({
                status: "scheduled", scheduledFor: {
                    $lte: now
                }
            });
            for (const post of postsToPublish) {
                try {
                    const accounts = await accountModel.find({
                        user: post.user,
                        platform: {
                            $in: post.platforms
                        },
                        status: "connected",
                        zernioAccountId: {
                            $exists: true
                        }
                    })
                    if (accounts.length === 0) {
                        console.log(`No connected zernio accounts found for post ${post._id}`);
                        continue;
                    }
                    const zernioPlatforms = accounts.map((acc) => ({
                        platform: acc.platform,
                        accountId: acc.zernioAccountId
                    }))
                    const payload = {
                        content: post.content,
                        publishNow: true,
                        ...(post.mediaUrl ? { mediaItems: [{ type: post.mediaType || "image", url: post.mediaUrl }] } : {}),
                        platforms: zernioPlatforms
                    }
                    console.log(`publishing post ${post._id} to zernio with media: ${post.mediaUrl || "none"}`)
                    const response = await zernio.posts.createPost({
                        body: payload
                    })
                    const publishedPost = (response.data)?.post || response.data;
                    if (!publishedPost) {
                        throw new Error("Failed to get post object from zernio response.")
                    }
                    console.log(`Zernio post created: ${publishedPost._id || publishedPost.id}`)
                    post.status = "published";
                    await post.save();

                    await activityModel.create({
                        user: post.user,
                        actionType: "POST_PUBLISHED",
                        description: `Published post to ${accounts.map((a) => a.platform).join(", ")}`,
                        relatedPost: post._id
                    })
                } catch (error) {
                    console.log(`Failed to publish post ${post._id} : ${error?.response?.data || error?.message}`)
                    post.status = "failed";
                    await post.save();
                }
            }
            if (postsToPublish.length > 0) {
                console.log(`Evaluated ${postsToPublish.length} posts at ${now.toISOString()}`)
            }
        } catch (error) {
            console.error(`Error in Scheduler: ${error}`)
        }
    })
}

const initRefreshTokenExpire = async () => {
    cron.schedule("*/13 * * * *", async () => {
        const users = await userModel.find();
        
        for (const user of users) {

            if (
                user.refreshTokenExpireAt &&
                user.refreshTokenExpireAt < Date.now()
            ) {
                user.refreshToken = null;
                user.refreshTokenExpireAt = null;
                await user.save();
            }
        }
    });
}
module.exports = { initScheduler, initRefreshTokenExpire }