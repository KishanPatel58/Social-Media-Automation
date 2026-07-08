const imageKit = require("../config/imagekit/imagekit.config");
const fs = require("fs");
const uploadImage = async ({file, filename}) => {
    try {
        const uploadedImage = await imageKit.upload({
            file: fs.createReadStream(file),
            fileName: filename
        })
        return uploadedImage.url
    } catch (error) {
        throw new Error("Error To Upload Image.", error.message)
    }
}

module.exports = uploadImage;