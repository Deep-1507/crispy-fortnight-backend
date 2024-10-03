import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    addressLine: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    type: { type: String, enum: ['Home', 'Work', 'Other'], required: true },
    default: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
}, { timestamps: true });

export const Address = mongoose.model('Address', addressSchema);