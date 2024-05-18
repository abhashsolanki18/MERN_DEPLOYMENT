import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloud = async (fileBuffer, title, description) => {
  try {
    const result = await cloudinary.uploader.upload(fileBuffer, {
      resource_type: 'auto',
      folder: 'images', // Change this to your desired folder
      public_id: title,
      tags: 'display',
      context: {
        caption: title,
        alt: description,
      },
    });
    console.log('File uploaded', result.url);
    return result.url;
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw error;
  }
};

export { uploadOnCloud };
