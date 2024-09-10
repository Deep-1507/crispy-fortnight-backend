

import Doctor from "../models/doctorModel.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import sendApprovalEmail from "../services/emailService.js";
import { sendRejectionEmail } from "../services/emailService.js";
import Hospital from "../models/hospitalModel.js";
import Category from "../models/categoryModel.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Function to handle file uploads
const uploadFile = (file, folder) => {
  const uploadPath = path.join(__dirname, "../uploads", folder, file.name);
  file.mv(uploadPath, (err) => {
    if (err) {
      throw err;
    }
  });
  return file.name;
};

// const validateTimingSlots = (timingSlots) => {
//   return timingSlots.every(slot => 
//     slot.day && slot.startTime && slot.endTime
//   );
// }

// Register doctor
export const registerDoctor = async (req, res) => {
  try {
    const {
      doctorName,
      category,
      phone,
      otherCategory,
      password,
      dob,
      gender,
      hospitalId,
      registrationNo,
      registrationCouncil,
      otherCouncil,
      registrationYear,
      degree,
      otherDegree,
      college,
      otherCollege,
      completionYear,
      experience,
      establishmentName,
      city,
      state,
      landmark,
      address,
      pincode,
      latitude,
      longitude,
      email,
      timingSlots,
      description,
      consultancyFees,
    } = req.body;

    const categories = typeof category === "string" ? JSON.parse(category) : category;


    console.log("Received timingSlots:", timingSlots);

    // Handle file uploads
    const identityProof = req.files.identityProof
      ? uploadFile(req.files.identityProof, "identityProof")
      : "";
    const identityProof2 = req.files.identityProof2
      ? uploadFile(req.files.identityProof2, "identityProof2")
      : "";
    const avatar = req.files.avatar ? uploadFile(req.files.avatar, "avatar") : "";
    const medicalRegistrationProof = req.files.medicalRegistrationProof
      ? uploadFile(req.files.medicalRegistrationProof, "medicalRegistrationProof")
      : "";
    const establishmentProof = req.files.establishmentProof
      ? uploadFile(req.files.establishmentProof, "establishmentProof")
      : "";

    // Create new doctor record
    const doctor = new Doctor({
      doctorName,
      category: categories,
      avatar,
      phone,
      otherCategory,
      password,
      dob,
      gender,
      hospitalId,
      registrationNo,
      registrationCouncil,
      otherCouncil,
      registrationYear,
      degree,
      otherDegree,
      college,
      otherCollege,
      completionYear,
      experience,
      establishmentName,
      city,
      state,
      landmark,
      address,
      pincode,
      latitude,
      longitude,
      email,
      description,
      timingSlots: JSON.parse(timingSlots || "[]"), // Default to empty array if timingSlots is not provided
      consultancyFees,
      identityProof,
      identityProof2,
      medicalRegistrationProof,
      establishmentProof,
    });

    // Save doctor to database
    await doctor.save();

    // Find the hospital document
    const hospital = await Hospital.findOne({ hospitalId: hospitalId });
    if (hospital) {
      // If hospital found, update hospital with new doctor
      await Hospital.findOneAndUpdate(
        { hospitalId: hospitalId },
        { $push: { doctors: doctor } }, // Push doctor ID to hospital's doctors array
        { new: true } // Return updated document
      );
    }

    // Iterate over each category and update the Category model
    for (let cat of categories) {
      // Check if the category exists in the Category model
      let existingCategory = await Category.findOne({ categoryName: cat });

      if (existingCategory) {
        // If the category exists, update it with both the doctor and hospital
        await Category.findOneAndUpdate(
          { categoryName: cat },
          {
            $addToSet: { doctors: doctor, hospitals: hospital}, // Add doctor and hospital (no duplicates)
          },
          { new: true }
        );
      } else {
        // Create a new category if it doesn't exist
        const newCategory = new Category({
          categoryIcon: 'https://png.pngtree.com/png-vector/20190228/ourmid/pngtree-first-aid-icon-design-template-vector-isolated-png-image_707530.jpg', // Default icon, customize as needed
          categoryName: cat,
          doctors: [doctor],
          hospitals: [hospital],
        });
        await newCategory.save();
      }
    }


    res.status(201).json({ message: "Doctor registered successfully!" });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Duplicate key error", details: error.keyValue });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    // Fetch all doctor records from the database
    const doctors = await Doctor.find({});

    // Base URL for file serving
    const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;

    // Map the doctor records to include full URLs for file proofs
    res.json(
      doctors.map((doctor) => ({
        ...doctor._doc,
        identityProof: doctor.identityProof ? `${baseUrl}identityProof/${doctor.identityProof}` : "",
        identityProof2: doctor.identityProof2 ? `${baseUrl}identityProof2/${doctor.identityProof2}` : "",
        medicalRegistrationProof: doctor.medicalRegistrationProof ? `${baseUrl}medicalRegistrationProof/${doctor.medicalRegistrationProof}` : "",
        establishmentProof: doctor.establishmentProof ? `${baseUrl}establishmentProof/${doctor.establishmentProof}` : "",
        avatar: doctor.avatar ? `${baseUrl}avatar/${doctor.avatar}` : "",
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors", error });
  }
};

// Approve a doctor
export const approveDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (doctor.isApproved) {
      return res.status(400).json({ message: "Doctor is already approved" });
    }

    doctor.isApproved = true;
    await doctor.save();

    await sendApprovalEmail(doctor);

    res.status(200).json({ message: "Doctor approved successfully" });
  } catch (error) {
    console.error("Error approving doctor:", error);
    res.status(500).json({ message: "Error approving doctor", error: error.message });
  }
};

export const rejectDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { customMessage } = req.body; // Get custom message from request body

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!doctor.isApproved) {
      return res.status(400).json({ message: "Doctor is already rejected" });
    }

    doctor.isApproved = false; // Mark doctor as rejected
    await doctor.save();

    // Send the rejection email with the custom message
    await sendRejectionEmail(doctor, customMessage);

    res.status(200).json({ message: "Doctor rejected successfully" });
  } catch (error) {
    console.error("Error rejecting doctor:", error);
    res.status(500).json({ message: "Error rejecting doctor", error: error.message });
  }
};

// Get doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ message: "Error fetching doctor", error: error.message });
  }
};