require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'jpeg', 'png'],
    params: {
        folder: 'Pest Reportig Application',
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
    },
});

module.exports = storage;