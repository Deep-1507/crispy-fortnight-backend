import express from "express";
import Hospital from "../models/hospitalModel.js";
import path from "path";
import Category from "../models/categoryModel.js";
import { fileURLToPath } from "url";
const router = express.Router();

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


// Route to register a new hospital
export const registerHospital = async (req, res) => {
  try {
    const {
      hospitalName,
      hospitalId,
      category,
      specialization,
      services,
      description,
      city,
      state,
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

    const hospitalImage = req.files.hospitalImage
      ? uploadFile(req.files.hospitalImage, "hospitalImage")
      : "";     

    console.log("Received timingSlots:", timings);

    const parsedSpecializations = Array.isArray(specialization) ? specialization : [specialization];
  const parsedServices = Array.isArray(services) ? services : [services];

    const hospital = new Hospital({
      hospitalName,
      hospitalImage,
      hospitalId,
      category: categories,
      specialization: parsedSpecializations, 
      services: parsedServices, 
      description,
      city,
      state,
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

export const approveHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    hospital.isApproved = true;
    await hospital.save();

    res.status(200).json({ message: "Hospital approved successfully!" });
  } catch (error) {
    console.error("Error approving hospital:", error);
    res
      .status(500)
      .json({ message: "Error approving hospital", error: error.message });
  }
};

export default router;
