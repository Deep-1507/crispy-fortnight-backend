import express from 'express';
import multer from 'multer';
import { imageUpload } from '../middleware/imageUpload.js'; 

// Initialize router
const router = express.Router();

// Set up Multer for file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Define the route and use the controller
router.post('/upload', upload.single('image'), imageUpload);

export default router;