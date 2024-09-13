
import Doctor from "../models/doctorModel.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import {sendApprovalEmail} from "../services/emailService.js";
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


export const checkEmailExists = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if a doctor with the given email already exists
    const existingDoctor = await Doctor.findOne({ email });

    if (existingDoctor) {
      return res.status(400).json({ message: "Email already exists" });
    }

    return res.status(200).json({ message: "Email is available" });
  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const checkPhoneExists = async (req, res) => {
  try {
    const { phone } = req.body;

    // Check if a doctor with the given phone already exists
    const existingDoctor = await Doctor.findOne({ phone });

    if (existingDoctor) {
      return res.status(400).json({ message: "Phone already exists" });
    }

    return res.status(200).json({ message: "Phone is available" });
  } catch (error) {
    console.error("Error checking phone:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


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

    const parsedDegree = Array.isArray(degree) ? degree : JSON.parse(degree);

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
      degree: parsedDegree,
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
        // If the category is a subcategory (has a parentCategoryId)
        if (existingCategory.parentCategoryId) {
          // Update subcategory with doctor and hospital
          await Category.findOneAndUpdate(
            { categoryName: cat },
            { $addToSet: { doctors: doctor, hospitals: hospital } }, // Add doctor and hospital to subcategory
            { new: true }
          );

          // Find parent category
          const parentCategory = await Category.findById(existingCategory.parentCategoryId);
          if (parentCategory) {
            // Update parent category with doctor and hospital
            await Category.findByIdAndUpdate(
              existingCategory.parentCategoryId,
              { $addToSet: { doctors: doctor, hospitals: hospital } }, // Add doctor and hospital to parent category
              { new: true }
            );
          }
        } else {
          // If the category is a parent category (parentCategoryId: null)
          await Category.findOneAndUpdate(
            { categoryName: cat },
            { $addToSet: { doctors: doctor, hospitals: hospital } }, // Add doctor and hospital to parent category
            { new: true }
          );
        }
      } else {
        // Create a new category if it doesn't exist
        const newCategory = new Category({
          categoryIcon: 'https://png.pngtree.com/png-vector/20190228/ourmid/pngtree-first-aid-icon-design-template-vector-isolated-png-image_707530.jpg', // Default icon, customize as needed
          categoryName: cat,
          status: 'inactive',
          doctors: [doctor],
          hospitals: [hospital],
          parentCategoryId: null // Default as a parent category (can be set dynamically if needed)
        });
        await newCategory.save();
      }
    }

    res.status(201).json({ message: "Doctor registered successfully!" });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate key error", details: error.keyValue });
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

    // Find the doctor in the database
    const doctor = await Doctor.findById(doctorId);

    // If doctor not found, return 404
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Send the rejection email before deleting the doctor
    await sendRejectionEmail(doctor, customMessage);

    // Once the email is sent, delete the doctor from the database
    await doctor.deleteOne();

    res.status(200).json({ message: "Doctor rejected and deleted successfully" });
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


export const searchDoctors = async (req, res) => {
  try {
    // Extract search parameters from the query
    const { 
      doctorName, 
      phone, 
      category, 
      email, 
      hospitalId, 
      city, 
      state, 
      registrationNo, 
      registrationCouncil, 
      establishmentName,
      // latitude, 
      // longitude, 
    } = req.query;

    // Build a query object dynamically based on provided filters
    const query = {};

    // Search by doctorName (case-insensitive)
    if (doctorName) query.doctorName = new RegExp(doctorName, 'i');
    
    // Search by phone number
    if (phone) query.phone = phone;
    
    // // Search by category (array)
    if (category) {
      query.category = { 
        $elemMatch: { $regex: category, $options: 'i' } 
      };
    }
    
    // Search by email
    if (email) query.email = email;
    
    // Search by hospitalId and convert it to ObjectId
    if (hospitalId) {
      query.hospitalId = hospitalId;
    }
    
    // Search by city and state
    if (city) query.city = city;
    if (state) query.state = state;
    
    // Search by registration number and council
    if (registrationNo) query.registrationNo = registrationNo;
    if (registrationCouncil) query.registrationCouncil = registrationCouncil;
    
    
    // Search by establishment name (case-insensitive)
    if (establishmentName) query.establishmentName = new RegExp(establishmentName, 'i');

    // Search by geolocation (latitude and longitude)
    // if (latitude && longitude) {
    //   query.location = {
    //     $near: {
    //       $geometry: {
    //         type: "Point",
    //         coordinates: [parseFloat(longitude), parseFloat(latitude)],
    //       },
    //       $maxDistance: parseFloat(maxDistance), // Maximum distance in meters (default is 5000)
    //     },
    //   };
    // }

    // Find doctors matching the query
    const doctors = await Doctor.find(query);

    // Send the results back as JSON
    res.json(doctors);
  } catch (error) {
    console.error("Error searching doctors:", error);
    res.status(500).json({ message: "Error searching doctors", error: error.message });
  }
};