

import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dcd08eduy", // Use environment variables for safety
  api_key: "575399779928335",
  api_secret: "CHSLKE9WhzE8obv2D7d8lbAwHjk",
});

// Cloudinary storage
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'doctors', // Set folder name where the images will be stored
//     allowed_formats: ['jpg', 'png'],
//   },
// });

// const upload = multer({ storage: storage });

// export { cloudinary, upload };

// const Cloudinary = require("cloudinary").v2;
// const upload = async(filePath) => {
//   try{
//     const result = await Cloudinary.uploader.upload(filePath);
//     console.log(result);
//     return result;
//   } catch (error){
//     console.error(error);
//   }

// }

