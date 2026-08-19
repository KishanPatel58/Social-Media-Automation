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
                status: "scheduled",
                scheduledFor: {
                    $lte: now
                }
            });

            for (const post of postsToPublish) {
                try {
                    // Find connected accounts
                    const accounts = await accountModel.find({
                        user: post.user,
                        platform: {
                            $in: post.platforms
                        },
                        status: "connected",
                        zernioAccountId: {
                            $exists: true
                        }
                    });

                    // No connected accounts
                    if (accounts.length === 0) {
                        console.log(
                            `❌ No connected Zernio accounts found for post ${post._id}`
                        );

                        continue;
                    }

                    // Prepare platforms
                    const zernioPlatforms = accounts.map((acc) => ({
                        platform: acc.platform,
                        accountId: acc.zernioAccountId
                    }));

                    // Prepare payload
                    const payload = {
                        content: post.content,
                        publishNow: true,

                        ...(post.media?.length
                            ? {
                                mediaItems: post.media.map((item) => ({
                                    type: item.type,
                                    url: item.url
                                }))
                            }
                            : {}),

                        platforms: zernioPlatforms
                    };

                    // Important: Don't try publishing Instagram without media
                    const hasInstagram = accounts.some(
                        (account) =>
                            account.platform === "instagram" ||
                            account.platform === "instagram_business"
                    );

                    if (hasInstagram && !post.media?.length) {
                        throw new Error(
                            "Instagram posts require at least one image or video."
                        );
                    }

                    // Publish to Zernio
                    const response = await zernio.posts.createPost({
                        body: payload
                    });

                    const publishedPost =
                        response.data?.post || response.data;

                    if (!publishedPost) {
                        throw new Error(
                            "Failed to get post object from Zernio response."
                        );
                    }

                    // Update post status
                    post.status = "published";

                    await post.save();

                    // Create activity
                    await activityModel.create({
                        user: post.user,
                        actionType: "POST_PUBLISHED",
                        description: `Published post to ${accounts
                            .map((a) => a.platform)
                            .join(", ")}`,
                        relatedPost: post._id
                    });


                } catch (error) {

                    if (error?.response?.data) {
                        console.error(
                            JSON.stringify(
                                error.response.data,
                                null,
                                2
                            )
                        );
                    } else {
                        console.error(
                            error
                        );
                    }


                    // Mark post as failed
                    post.status = "failed";

                    await post.save();

                }
            }

            if (postsToPublish.length > 0) {
                console.log(
                    `\nEvaluated ${postsToPublish.length} posts at ${now.toISOString()}`
                );
            }

        } catch (error) {

            console.error(
                "\n❌ ERROR IN SCHEDULER"
            );

            console.error(
                error
            );
        }
    });
};

const initRefreshTokenExpire = async () => {
    cron.schedule("0 0 * * *", async () => {
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