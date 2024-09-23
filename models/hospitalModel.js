import mongoose from "mongoose";
const { Schema } = mongoose;

const hospitalSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  hospitalImages:
  {
    type: [String],
    required: true,
  },
  hospitalId: { type: String, required: true, },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  category: {
    type: [String], // Change from String to Array of Strings
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
  latitude: { type: Number },
  longitude: { type: Number },
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
    required: false,
  },
  insuranceClaim: {
    type: Boolean,
    required: true,
  },
  hospitalType : {
    type: String,
    required: true,
  },
  institutionType: {
    type: String,
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
  isApproved: { type: Boolean, default: false },
  doctors: [{
    type: Schema.Types.ObjectId,
    ref: 'Doctor', // Reference to Doctor documents associated with this category
    default: [], // Default to an empty array
  }],
  
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;
