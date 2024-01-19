import dotenv from "dotenv";
import { CloudinaryStorage } from "multer-storage-cloudinary";
//import cloudinary from "cloudinary";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// New object of Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  allowed_formats: ["jpg", "jpeg", "png"],
  params: {
    folder: "blog-app-v1",
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

export default storage;
