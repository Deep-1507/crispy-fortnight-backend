// backend/multerConfig.js
import multer from 'multer';
import path from 'path';

// Define storage for the avatars
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars'); // Directory where the files will be saved
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Add a unique suffix to the file name
  }
});

// Create a multer instance with the storage configuration
const upload = multer({ storage });

export default upload;
