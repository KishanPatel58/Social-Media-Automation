const { GoogleGenAI } =
    require("@google/genai");

const generateAndUploadImage =
    require("../utils/uploadImage");

const generationModel =
    require("../models/generation.model");

const ENV =
    require("../config/env.config");
const postModel = require("../models/post.model");
const imageKit = require("../config/imagekit/imagekit.config");

const generatePost = async (
    req,
    res
) => {

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

        console.log(error);

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
                parsedPlatforms = JSON.parse(platforms)
            } catch (error) {
                parsedPlatforms = platforms.split(",")
            }
        }
        let mediaUrl = req.body.mediaUrl;
        let mediaType = req.body.mediaType;
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const response = imageKit.upload({
                    file: req.body.file,
                    fileName: req.body.file.originalName
                })
                if (!response) {
                    reject("Problem to upload File.")
                } else {
                    resolve(response.url)
                }
            })


        }
        mediaUrl = result;
        mediaType = req.file.startsWith("/images") ? "image0" : "video";
        const post = await postModel.create({
            user: req.user._id,
            content,
            platforms: parsedPlatforms,
            mediaUrl,
            mediaType,
            scheduledFor,
            status
        })
        res.status(201).json(post)
    } catch (error) {
        return res.status(500).json({ message: `${error.message}` });
    }
}
module.exports = {
    generatePost,
    getGenerations,
    getPosts,
    schedulePost
};