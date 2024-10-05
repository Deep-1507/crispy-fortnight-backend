import express from "express";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import doctorRoutes from "./routes/doctorRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import searchRoutes from './routes/searchRoutes.js';
import uploadRoutes from './routes/imageRoutes.js';
import emailVerificationRoute from './routes/emailVerificationRoute.js';
import categoryRoute from './routes/categoryRoutes.js';
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();



app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
// app.use(fileUpload());

app.use("/api/doctors", doctorRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api', searchRoutes);
app.use('/api/emailVerification', emailVerificationRoute);
app.use('/api/categories', categoryRoute);
app.use("/api/users", userRoutes);
app.use("/api/address", addressRoutes);
app.use('/api/image', uploadRoutes);

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' data:; script-src 'self' https://apis.google.com;");
  next();
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
