import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  mobileNumber: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    required: true,
  }
});

export default model('User', userSchema);
