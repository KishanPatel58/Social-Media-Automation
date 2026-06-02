const ENV = require("../config/environments/env")
import { GoogleGenAI } from "@google/genai";
// Generate post
// Endpoint POST api/posts/generate
const generatePost = async (req, res) => {
    try {
        const { prompt, tone, generateImage } = req.body;
        const geminiApiKey = ENV.GEMINI_API_KEY;
        if (!geminiApiKey) {
            return res.status(400).json({ message: "Apikey is Missing.." });
        }
        const ai = new GoogleGenAI({ geminiApiKey });
        // Generate Text Content
        const textResponse = await ai.models.generateContent({
            model: ENV.GEMINI_MODEL,
            contents: `You are a social media manager. create a social media post with this prompt: "${prompt}". tone of the post should be "${tone}". The post should be engaging and creative and include relevant hashtags. Format the response in JSON with "content" and "imagePrompt" fields. The "imagePrompt" should be a highly descriptive prompt for an image generator that complements the post.`,
        });
        let content = "";
        let imagePrompt = prompt;
        try {
            const rawText = textResponse.text || "";
            const jsonMatch = rawText.match(/\{[\s\S]*}/);
            const data = jsonMatch ? JSON.parse(jsonMatch[0]) : {content: rawText, imagePrompt: prompt};
            content = data.content;
            imagePrompt = data.imagePrompt;
        } catch (error) {
            content = textResponse.text || "";
        }
        
    } catch (error) {
        return res.status(500).json({ message: `Error: ${error.message}` })
    }
}

// Get generations
// Endpoint GET api/posts/generations
const getGenerations = async (req, res) => {

}

// Get post
// Endpoint GET api/posts
const getPosts = async (req, res) => {

}

// Schedule post
// Endpoint POST api/posts
const schedulePost = async (req, res) => {

}
module.exports = {
    generatePost,
    getGenerations,
    getPosts,
    schedulePost
}