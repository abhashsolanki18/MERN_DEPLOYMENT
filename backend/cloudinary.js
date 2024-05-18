import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloud = (fileBuffer, title, description) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'images',
        public_id: title,
        tags: 'display',
        context: {
          caption: title,
          alt: description,
        },
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading file to Cloudinary:', error);
          reject(error);
        } else {
          console.log('File uploaded', result.url);
          resolve(result.url);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export { uploadOnCloud };
