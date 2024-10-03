import  User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

// user modal for mobile app
export const userModal = async (req, res) => {
    const { phone, fid } = req.body;

    try {
        let user = await User.findOne({ fid });

        if (user) {
            if (user.phone === phone) {
                const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
                return res.status(200).json({ token });
            } else {
                return res.status(400).json({ message: "Phone number does not match." });
            }
        }

        user = new User({ phone, fid });
        await user.save();

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        return res.status(201).json({ token });

    } catch (error) {
        console.error("Error in /auth route:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update user controller
export const updateUser = async (req, res) => {
    const { fid, phone, fullName, profileImage, dob, bloodGroup, gender, abhaId } = req.body;
    const userId = req.userId; // Extracted from the JWT in authMiddleware
    let user;

    try {
        // If fid is provided, find user by fid, otherwise use userId from the JWT
        if (fid) {
            user = await User.findOne({ fid });
        } else {
            user = await User.findById(userId);
        }

        // If user is not found, return 404
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Update user details if provided in the request body
        if (phone) user.phone = phone;
        if (fullName) user.fullName = fullName;
        if (profileImage) user.profileImage = profileImage;
        if (dob) user.dob = new Date(dob);
        if (bloodGroup) user.bloodGroup = bloodGroup;
        if (gender) user.gender = gender;
        if (abhaId) user.abhaId = abhaId;

        // Save the updated user
        await user.save();

        return res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error in updateUser route:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};





