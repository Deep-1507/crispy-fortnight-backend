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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Routes
app.use("/api/doctors", doctorRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api', searchRoutes);
app.use('/api/emailVerification', emailVerificationRoute);
app.use('/api/categories', categoryRoute);

// Global error handler (put this at the end)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
