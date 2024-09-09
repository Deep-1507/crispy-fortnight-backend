// models/Doctor.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const doctorSchema = new mongoose.Schema({
  doctorName: { type: String, required: true }, // Add doctor's name for signup
  phone: { type: Number, required: true, unique: true }, // Add mobile number for signup
  category: {
    type: [String], // Change from String to Array of Strings
    required: true,
  },
  otherCategory: { type: String }, // Add category for signup
  avatar: { type: String }, // Add profile avatar for signup
  password: { type: String, required: true },
  dob: { type: String, required: true },
  gender : { type: String, required: true },
  email: {
    type: String,
    required: true, // Ensure the email field is required
    unique: true, // Ensure the email field is unique
    trim: true,
    lowercase: true,
  },
  hospitalId: { type: String, unique: true },
  registrationNo: { type: String, required: true, unique: true },
  registrationCouncil: { type: String, required: true },
  otherCouncil: { type: String },
  registrationYear: { type: String, required: true },
  degree: { type: String, required: true },
  otherDegree: { type: String },
  college: { type: String, required: true },
  otherCollege: { type: String },

  completionYear: { type: String, required: true },
  experience: { type: String, required: true },
  establishmentName: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  landmark: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: Number, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String, required: true },
  pincode: { type: Number, required: true },
  identityProof: { type: String, required: true },
  identityProof2: { type: String, required: false }, 
  medicalRegistrationProof: { type: String, required: true },
  establishmentProof: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  timingSlots: [
    {
      days: [{ type: String, required: true }],
      startTime: { type: String },
      endTime: { type: String },
      morningStart: { type: String }, // Updated field names
      morningEnd: { type: String },
      afternoonStart: { type: String },
      afternoonEnd: { type: String },
    },
  ],
  description: {
    type: String,
    required: false,
  },
  consultancyFees: { type: Number, required: true },
});

doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});
const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
