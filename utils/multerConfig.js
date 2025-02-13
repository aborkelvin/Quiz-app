const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinaryConfig");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "quiz_app", // Name of the folder in Cloudinary
    resource_type: "auto", // Automatically detect file type (image/video)
  },
});

const upload = multer({ storage });

module.exports = upload;
