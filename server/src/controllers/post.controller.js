const { GoogleGenAI } =
    require("@google/genai");

const generateAndUploadImage =
    require("../services/generateAndUploadImage");

const generationModel =
    require("../models/generation.model");
const sharp = require("sharp");
const ENV = require("../config/environments/env");
const postModel = require("../models/post.model");
const imageKit = require("../config/imagekit/imagekit.config");

const generatePost = async (req, res) => {

    try {

        const {
            prompt,
            tone,
            generateImage,
        } = req.body;

        const geminiApiKey =
            ENV.GEMINI_API_KEY;

        if (!geminiApiKey) {

            return res.status(400).json({
                message:
                    "ApiKey is Missing.."
            });
        }

        const ai =
            new GoogleGenAI({

                apiKey:
                    geminiApiKey
            });



        const textResponse =
            await ai.models.generateContent({

                model:
                    ENV.GEMINI_MODEL,

                contents:
                    `You are a social media manager.
Create a social media post with this prompt:

"${prompt}"

Tone of the post should be:

"${tone}"

The post should be engaging and creative and include relevant hashtags.

Format response in JSON:

{
   "content":"",
   "imagePrompt":""
}

imagePrompt should be highly descriptive.`,
            });



        let content = "";
        let imagePrompt = prompt;

        try {

            const rawText =
                textResponse.text || "";

            const jsonMatch =
                rawText.match(/\{[\s\S]*}/);

            const data =
                jsonMatch

                    ? JSON.parse(
                        jsonMatch[0]
                    )

                    : {
                        content:
                            rawText,

                        imagePrompt:
                            prompt
                    };

            content =
                data.content;

            imagePrompt =
                data.imagePrompt;

        } catch (error) {

            content =
                textResponse.text || "";
        }



        let mediaUrl = "";

        if (generateImage) {

            try {

                mediaUrl =
                    await generateAndUploadImage(
                        imagePrompt
                    );

            } catch (error) {

                mediaUrl = "";
            }
        }



        const generation =
            await generationModel.create({

                user:
                    req.user._id,
                prompt,

                content,

                mediaUrl,

                mediaType:
                    mediaUrl
                        ? "image"
                        : undefined,

                tone,
            });



        return res.status(201).json({

            success: true,

            message:
                "Post Created Successfully.",

            generation,
        });

    } catch (error) {


        return res.status(500).json({

            success: false,

            message:
                `Error: ${error.message}`
        });
    }
};

const getGenerations = async (req, res) => {
    try {
        const generations = await generationModel.find({ user: req.user._id }).sort({ createdAt: -1 })
        return res.status(200).json(generations)
    } catch (error) {
        return res.status(500).json({ message: `${error.message}` });
    }
}

const getPosts = async (req, res) => {
    try {
        const posts = await postModel.find({ user: req.user._id })
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json({ message: `${error.message}` });
    }
}

const schedulePost = async (req, res) => {
    try {
        const { content, platforms, scheduledFor, status } = req.body;

        let parsedPlatforms = platforms;

        if (typeof platforms === "string") {
            try {
                parsedPlatforms = JSON.parse(platforms);
            } catch (error) {
                parsedPlatforms = platforms.split(",");
            }
        }

        const fs = require("fs");

        let media = [];

        // =========================================================
        // MULTIPLE MEDIA FILES
        // =========================================================

        if (req.files && req.files.length > 0) {

            for (const file of req.files) {

                // Read uploaded file
                let fileToUpload = fs.readFileSync(file.path);

                // =====================================================
                // IMAGE CROP / RESIZE
                // =====================================================

                if (file.mimetype.startsWith("image/")) {

                    const metadata = await sharp(fileToUpload).metadata();

                    const width = metadata.width;
                    const height = metadata.height;

                    if (width && height) {

                        const aspectRatio = width / height;

                        // Instagram Feed allowed range:
                        // 0.75 : 1  →  1.91 : 1

                        if (
                            aspectRatio < 0.75 ||
                            aspectRatio > 1.91
                        ) {

                            console.log(
                                `Image ${file.originalname} ratio ${aspectRatio.toFixed(2)} is outside Instagram range. Cropping to 4:5...`
                            );

                            fileToUpload = await sharp(fileToUpload)
                                .resize(1080, 1350, {
                                    fit: "cover",
                                    position: "centre"
                                })
                                .jpeg({
                                    quality: 90
                                })
                                .toBuffer();
                        }
                    }
                }

                // =====================================================
                // UPLOAD TO IMAGEKIT
                // =====================================================

                const result = await imageKit.upload({
                    file: fileToUpload,
                    fileName: file.originalname,
                });

                // =====================================================
                // DETERMINE MEDIA TYPE
                // =====================================================

                let mediaType;

                if (file.mimetype.startsWith("image/")) {
                    mediaType = "image";
                } else if (file.mimetype.startsWith("video/")) {
                    mediaType = "video";
                }

                // =====================================================
                // ADD MEDIA TO ARRAY
                // =====================================================

                media.push({
                    url: result.url,
                    type: mediaType
                });
            }
        }

        // =========================================================
        // CREATE POST
        // =========================================================

        const post = await postModel.create({
            user: req.user._id,
            content,
            platforms: parsedPlatforms,
            media,
            scheduledFor,
            status
        });

        res.status(201).json(post);

    } catch (error) {

        return res.status(500).json({
            message: `${error.message}`
        });
    }
};
const deletePost = async (req, res) => {
    try {
        const { postid } = req.params;
        // Find the post and make sure it belongs to the logged-in user
        const post = await postModel.findOne({
            _id: postid,
            user: req.user._id,
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found or you don't have permission to delete it.",
            });
        }
        // Correct way to delete
        await postModel.deleteOne({ _id: postid });

        return res.status(200).json({
            success: true,
            message: "Post Deleted Successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error: ${error.message}`,
        });
    }
};

const updatePost = async (req, res) => {
    try {
        const { postid } = req.params;
        const { content, platforms, scheduledFor, mediaType, removeMedia } =
            req.body;
        const post = await postModel.findOne({
            _id: postid,
            user: req.user._id,
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found or you don't have permission to update it.",
            });
        }

        // Parse platforms
        let parsedPlatforms = platforms;
        if (typeof platforms === "string") {
            try {
                parsedPlatforms = JSON.parse(platforms);
            } catch (error) {
                parsedPlatforms = platforms.split(",").map((p) => p.trim());
            }
        }

        // Update text fields
        if (content !== undefined) post.content = content;
        if (parsedPlatforms !== undefined) post.platforms = parsedPlatforms;
        if (scheduledFor !== undefined) post.scheduledFor = scheduledFor;

        // ── Handle media ──────────────────────────────────────
        const fs = require("fs");
        // Case 1: User uploaded a new file
        if (req.file) {
            const result = await imageKit.upload({
                file: fs.readFileSync(req.file.path),
                fileName: req.file.originalname,
            });

            post.mediaUrl = result.url;

            const mime = req.file.mimetype;
            if (mime.startsWith("image/")) {
                post.mediaType = "image";
            } else if (mime.startsWith("video/")) {
                post.mediaType = "video";
            }

            // optional: delete temp file
            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                return res.status(401).json({
                    success: false,
                    message: "Problem To Update."
                })
            }
        }
        // Case 2: User removed media
        else if (removeMedia === "true") {
            post.mediaUrl = "";
            post.mediaType = undefined;
        }
        // Case 3: Only mediaType sent (no file change)
        else if (mediaType !== undefined) {
            post.mediaType = mediaType || undefined;
        }

        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post updated successfully.",
            post,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error: ${error.message}`,
        });
    }
};

const deleteGeneration = async (req, res) => {
    try {
        const { postid } = req.params;

        const generation = await generationModel.findOne({
            _id: postid,
            user: req.user._id || req.user.id, // only owner can delete
        });

        if (!generation) {
            return res.status(404).json({
                success: false,
                message: "Generation not found",
            });
        }

        await generationModel.deleteOne({ _id: postid });

        return res.status(200).json({
            success: true,
            message: "Generation deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    generatePost,
    getGenerations,
    getPosts,
    schedulePost,
    deletePost,
    updatePost,
    deleteGeneration
};