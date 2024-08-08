const cloudinary = require("cloudinary").v2;

const fs = require("fs");
// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
});
async function uploadOnCloudinary(file_path) {
    try {
        if (!file_path) return null;
        const uploadResult = await cloudinary.uploader.upload(file_path, {
            resource_type: "auto",
        });

        console.log(uploadResult.url);
        return uploadResult;
    } catch (error) {
        fs.unlinkSync(file_path);
        return null;
    }

    // Optimize delivery by resizing and applying auto-format and auto-quality
    // const optimizeUrl = cloudinary.url("shoes", {
    //     fetch_format: "auto",
    //     quality: "auto",
    // });

    // console.log(optimizeUrl);

    // Transform the image: auto-crop to square aspect_ratio
    // const autoCropUrl = cloudinary.url("shoes", {
    //     crop: "auto",
    //     gravity: "auto",
    //     width: 500,
    //     height: 500,
    // });

    // console.log(autoCropUrl);
}
module.exports = uploadOnCloudinary;
