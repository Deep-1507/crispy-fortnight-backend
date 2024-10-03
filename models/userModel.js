import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true
    },
    fid: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String
    },
    profileImage: {
        type: String
    },
    dob: {
        type: Date
    },
    bloodGroup: {
        type: String
    },
    gender: {
        type: String
    },
    abhaId: {
        type: String
    }
}, {
    collection: 'users', // Specify the collection name here
    timestamps: true 
});

const User = mongoose.model('User', userSchema);

export default User;