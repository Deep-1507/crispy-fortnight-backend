import { Schema, model } from 'mongoose';

const profileSchema = new Schema({
  fullName: String,
  profileImage: String,
  dob: Date,
  bloodGroup: String,
  gender: String,
  abhaId: String,
  mobileNumber: {
    type: String,
    unique: true,
    required: true
  }
});

export default model('UserProfile', profileSchema);
