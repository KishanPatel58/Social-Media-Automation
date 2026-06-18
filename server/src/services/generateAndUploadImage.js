const axios = require("axios");
const imageKit = require(
  "../config/imagekit/imagekit.config"
);


const generateAndUploadImage = async (prompt) => {

    try {


        const imageResponse =
            await axios({

                url:
`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`,

                method: "GET",

                responseType:
                    "arraybuffer",
            });

        const uploadedImage =
            await imageKit.upload({

                file:
                    imageResponse.data,

                fileName:
`ai-${Date.now()}.jpg`,
            });

        return uploadedImage.url;

    } catch (error) {

        throw new Error(
            "Image upload failed"
        );
    }
};

module.exports = generateAndUploadImage;