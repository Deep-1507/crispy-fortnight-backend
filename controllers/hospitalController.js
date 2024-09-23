import express from "express";
import Hospital from "../models/hospitalModel.js";
import path from "path";
import { sendApprovalHospital } from "../services/emailService.js";  
import Category from "../models/categoryModel.js";
import { fileURLToPath } from "url";
const router = express.Router();


const generateHospitalId = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ensure two digits for month
  const day = ('0' + date.getDate()).slice(-2); // Ensure two digits for day
  const randomDigits = Math.floor(1000000 + Math.random() * 9000000); // Generate a random 7-digit number
  return `HRN${year}${month}${day}${randomDigits}`;
};

// Route to register a new hospital
export const registerHospital = async (req, res) => {
  try {
    const {
      hospitalName,
      hospitalImages,
      // hospitalId,
      email,
      category,
      specialization,
      services,
      description,
      city,
      state,
      latitude,
      longitude,
      totalBeds,
      juniorDoctors,
      seniorDoctors,
      totalDoctorStaff,
      nursingStaff,
      timings, // This should be a JSON string
      insuranceClaim,
      contactDetails,
      hospitalType,
      institutionType
    } = req.body;

    const categories = typeof category === "string" ? JSON.parse(category) : category;

    
    console.log("Received timingSlots:", timings);
    const parsedhospitalImages = Array.isArray(hospitalImages) ? hospitalImages : JSON.parse(hospitalImages);
    const parsedSpecializations = Array.isArray(specialization) ? specialization : JSON.parse(specialization);
    const parsedServices = Array.isArray(services) ? services : JSON.parse(services);
    const hospitalId = generateHospitalId();
    
    const hospital = new Hospital({
      hospitalName,
      hospitalImages: parsedhospitalImages,
      hospitalId: hospitalId,
      email,
      category: categories,
      specialization: parsedSpecializations, 
      services: parsedServices, 
      description,
      city,
      state,
      latitude,
      longitude,
      totalBeds,
      totalDoctorStaff,
      nursingStaff,
      juniorDoctors,
      seniorDoctors,
      timings: JSON.parse(timings), // Parse the JSON string into an object
      insuranceClaim,
      hospitalType,
      institutionType,
      contactDetails,
      doctors:[]
    });
    await hospital.save();

    for (let cat of categories) {
      // Check if the category exists in the Category model
      let existingCategory = await Category.findOne({ categoryName: cat });

      if (existingCategory) {
        // If the category exists, update it with hospital
        await Category.findOneAndUpdate(
          { categoryName: cat },
          {
            $addToSet: { hospitals: hospital}, // Add hospital (no duplicates)
          },
          { new: true }
        );
      } else {
        // Create a new category if it doesn't exist
        const newCategory = new Category({
          categoryIcon: 'https://png.pngtree.com/png-vector/20190228/ourmid/pngtree-first-aid-icon-design-template-vector-isolated-png-image_707530.jpg', // Default icon, customize as needed
          categoryName: cat,
          doctors: [],
          hospitals: [hospital],
        });
        await newCategory.save();
      }
    }

    res.status(201).json({ message: "Hospital registered successfully!" });
  } catch (error) {
    console.error("Error registering hospital:", error);
    res
      .status(500)
      .json({ message: "Error registering hospital", error: error.message });
  }
};

// Route to get all hospitals
export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({});
    res.json(hospitals);
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res
      .status(500)
      .json({ message: "Error fetching hospitals", error: error.message });
  }
};

export const getHospitalById = async (req, res) => {
  try {
    const hospitalId = req.params.id;
    const hospital = await Hospital.findById(hospitalId).populate("doctors");

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.json(hospital);
  } catch (error) {
    console.error("Error fetching hospital:", error);
    res
      .status(500)
      .json({ message: "Error fetching hospital", error: error.message });
  }
};


export const approveHospital = async (req, res, next) => {
  try {
    const { hospitalId } = req.params;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    hospital.isApproved = true;
    await hospital.save();

    // Send the approval email asynchronously
    await sendApprovalHospital(hospital);

    res.status(200).json({ message: "Hospital approved successfully!" });
  } catch (error) {
    console.error("Error approving hospital:", error);
    next(error); // Use next() to pass errors to the global error handler
  }
};

export const searchHospitals = async (req, res) => {
  try {
    // Extract search parameters from the query
    const { 
      hospitalName, 
      category, 
      hospitalId, 
      specialization, 
      city, 
      state, 
      hospitalType, 
      institutionType, 
      services, 
    } = req.query;

    // Build a query object dynamically based on provided filters
    const query = {};

    if (hospitalName) query.hospitalName = new RegExp(hospitalName, 'i'); // Case insensitive search
    
    if (category) {
      query.category = { 
        $elemMatch: { $regex: category, $options: 'i' } 
      };
    }
    if (hospitalId) query.hospitalId = hospitalId;

    // Use regex for specialization and services fields
    if (specialization) {
      query.specialization = { 
        $elemMatch: { $regex: specialization, $options: 'i' } 
      };
    }
    
    if (city) query.city = city;
    if (state) query.state = state;
    if (hospitalType) query.hospitalType = hospitalType;
    if (institutionType) query.institutionType = institutionType;

    // Use regex for services array as well
    if (services) {
      query.services = { 
        $elemMatch: { $regex: services, $options: 'i' } 
      };
    }
    


    // Find hospitals matching the query
    const hospitals = await Hospital.find(query);

    // Send the results back as JSON
    res.json(hospitals);
  } catch (error) {
    console.error("Error searching hospitals:", error);
    res.status(500).json({ message: "Error searching hospitals", error: error.message });
  }
};

export default router;
