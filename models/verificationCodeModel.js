import { Schema, model } from 'mongoose';

const verificationCodeSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // The document will automatically be deleted after 10 minutes
  },
});

export default model('VerificationCode', verificationCodeSchema);
