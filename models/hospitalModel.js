import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  doctorName: { type: String, required: true }, // Add doctor's name for signup
  phone: { type: String, required: true }, // Add mobile number for signup
  category: { type: String, required: true }, // Add category for signup
  avatar: { type: String }, // Add profile avatar for signup
  password: { type: String, required: true },
  email: {
    type: String,
    required: true, 
    lowercase: true,
  },
  hospitalId: { type: String },
  registrationNo: { type: String, required: true },
  registrationCouncil: { type: String, required: true },
  registrationYear: { type: String, required: true },
  degree: { type: String, required: true },
  college: { type: String, required: true },
  completionYear: { type: String, required: true },
  experience: { type: String, required: true },
  establishmentName: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  identityProof: { type: String, required: true },
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
  consultancyFees: { type: String, required: true },
});

const hospitalSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  hospitalImage:{type:String},
  hospitalId: { type: String, unique: true , required: true, },
  category: {
    type: String,
    required: true,
  },
  specialization: [{ type: String }], 
  services: [{ type: String }],  
  description: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  totalBeds: {
    type: Number,
    required: true,
  },
  availableBeds: {
    type: Number,
    required: false,
  },
  seniorDoctors: {
    type: Number,
    required: false,
  },
  juniorDoctors: {
    type: Number,
    required: false,
  },
  totalDoctorStaff: {
    type: Number,
    required: true,
  },
  nursingStaff: {
    type: Number,
    required: true,
  },
  insuranceClaim: {
    type: Boolean,
    required: true,
  },
  contactDetails: {
    type: String,
    required: true,
  },

  timings: [
    {
      days: [{ type: String, required: true }],
      startTime: { type: String },
      endTime: { type: String },
    },
  ],
  insuranceClaim: String,
  doctors: [doctorSchema], // Field to store doctor references
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;
