import express from "express";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import doctorRoutes from "./routes/doctorRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import searchRoutes from './routes/searchRoutes.js';
import emailVerificationRoute from './routes/emailVerificationRoute.js';
import categoryRoute from './routes/categoryRoutes.js';
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';  // <-- Import fileURLToPath from 'url'

// Create __filename and __dirname using the fileURLToPath function
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create express app
const app = express();

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/doctors", doctorRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api', searchRoutes);
app.use('/api/emailVerification', emailVerificationRoute);
app.use('/api/categories', categoryRoute);

// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
