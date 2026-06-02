const axios = require("axios");
const imageKit = require(
  "../config/imagekit/imagekit.config"
);

/*
|--------------------------------------------------------------------------
| Generate AI Image + Upload To ImageKit
|--------------------------------------------------------------------------
*/

const generateAndUploadImage = async (prompt) => {

    try {

        /*
        |--------------------------------------------------------------------------
        | Generate Free AI Image
        |--------------------------------------------------------------------------
        */

        const imageResponse =
            await axios({

                url:
`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`,

                method: "GET",

                responseType:
                    "arraybuffer",
            });

        /*
        |--------------------------------------------------------------------------
        | Upload To ImageKit
        |--------------------------------------------------------------------------
        */

        const uploadedImage =
            await imageKit.upload({

                file:
                    imageResponse.data,

                fileName:
`ai-${Date.now()}.jpg`,
            });

        /*
        |--------------------------------------------------------------------------
        | Return Uploaded File URL
        |--------------------------------------------------------------------------
        */

        return uploadedImage.url;

    } catch (error) {

        console.log(error);

        throw new Error(
            "Image upload failed"
        );
    }
};

module.exports = generateAndUploadImage;