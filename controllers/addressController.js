import { Address } from '../models/addressModel.js';
import  User from '../models/userModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { body, validationResult } from 'express-validator'; // Import express-validator for validation

export const createAddress = [
    // Validation middleware
    body('addressLine').notEmpty().withMessage('Address Line is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('pincode').isNumeric().withMessage('Pincode must be numeric').notEmpty().withMessage('Pincode is required'),
    body('type').notEmpty().withMessage('Type is required').isIn(['Home', 'Work', 'Other']).withMessage('Invalid type provided'),
    body('latitude').optional().isFloat().withMessage('Latitude must be a valid number'),
    body('longitude').optional().isFloat().withMessage('Longitude must be a valid number'),

    // Route logic
    async (req, res) => {
        const { addressLine, latitude, longitude, city, state, pincode, type, default: isDefault, fid } = req.body;

        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            let userId;

            if (!fid) {
                userId = req.userId;  // Retrieve userId from authMiddleware
            } else {
                // Find the user associated with the provided fid
                const user = await User.findOne({ fid });

                if (!user) {
                    return res.status(404).json({ message: "User not found with provided fid." });
                }
                userId = user._id;  // Get the user ID from the found user document
            }

            if (!userId) {
                return res.status(400).json({ message: "UserID not provided." });
            }

            // Create the new address
            const newAddress = new Address({
                addressLine, latitude, longitude, city, state, pincode, type, default: isDefault, userId
            });

            await newAddress.save();

            // Response according to the provided format
            res.status(201).json({
                message: "Address created successfully.",
                addressId: newAddress._id,
                default: newAddress.default
            });
        } catch (error) {
            res.status(500).json({ message: "Error creating address", error });
        }
    }
];




export const updateAddress = [
    // Validation middleware
    body('addressLine').notEmpty().withMessage('Address Line is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('pincode').isNumeric().withMessage('Pincode must be numeric').notEmpty().withMessage('Pincode is required'),
    body('type').notEmpty().withMessage('Type is required').isIn(['Home', 'Work', 'Other']).withMessage('Invalid type provided'),
    body('latitude').optional().isFloat().withMessage('Latitude must be a valid number'),
    body('longitude').optional().isFloat().withMessage('Longitude must be a valid number'),

    // Route logic
    async (req, res) => {
        const { addressId, addressLine, latitude, longitude, city, state, pincode, type, default: isDefault } = req.body;

        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Find the address by ID
            const address = await Address.findById(addressId);

            if (!address) {
                return res.status(404).json({ message: "Address not found." });
            }

            // Update address fields only if they are provided
            address.addressLine = addressLine || address.addressLine;
            address.latitude = latitude || address.latitude;
            address.longitude = longitude || address.longitude;
            address.city = city || address.city;
            address.state = state || address.state;
            address.pincode = pincode || address.pincode;
            address.type = type || address.type;
            address.default = typeof isDefault !== 'undefined' ? isDefault : address.default;

            // Save the updated address
            await address.save();

            // Response
            res.status(200).json({
                message: "Address updated successfully.",
                addressId: address._id,
                default: address.default
            });
        } catch (error) {
            res.status(500).json({ message: "Error updating address", error });
        }
    }
];




export const listAddresses = async (req, res) => {
    try {
        const userId = req.userId;  // Retrieve userId from authMiddleware

        if (!userId) {
            return res.status(400).json({ message: "UserID not provided." });
        }

        // Find all addresses associated with the user
        const addresses = await Address.find({ userId });

        // Map the result to match the response structure
        const addressList = addresses.map(address => ({
            addressId: address._id,
            addressLine: address.addressLine,
            latitude: address.latitude,
            longitude: address.longitude,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            type: address.type,
            default: address.default
        }));

        // Return the address list in a structured format
        res.status(200).json(addressList);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving addresses", error });
    }
};



export const setDefaultAddress = async (req, res) => {
    const { addressId } = req.body;  // Get the addressId from the request body

    try {
        const userId = req.userId;  // Retrieve userId from authMiddleware

        if (!userId) {
            return res.status(400).json({ message: "UserID not provided." });
        }

        // Find the address by addressId and ensure it belongs to the user
        const address = await Address.findOne({ _id: addressId, userId });

        if (!address) {
            return res.status(404).json({ message: "Address not found or does not belong to the user." });
        }

        // Set all other addresses for this user to default: false
        await Address.updateMany({ userId, _id: { $ne: addressId } }, { default: false });

        // Set the selected address as default: true
        address.default = true;
        await address.save();

        res.status(200).json({
            message: "Address set as default successfully.",
            addressId: address._id,
            default: address.default
        });
    } catch (error) {
        res.status(500).json({ message: "Error setting default address", error });
    }
};