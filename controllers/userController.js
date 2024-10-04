import pkg from 'jsonwebtoken';
import User from '../models/userModel.js';
import Profile from '../models/UserProfileModel.js';
const JWT_SECRET = process.env.JWT_SECRET;

// Login or Register user
const { sign } = pkg;
export const loginUser  = async (req, res) => {
  const { mobileNumber, username } = req.body;

  try {
    let profile = await Profile.findOne({ mobileNumber });

    if (!profile) {
      profile = new Profile({ mobileNumber });
      await profile.save();
    }

    await User.findOneAndDelete({ mobileNumber });

    const newUser = new User({ mobileNumber, username });
    await newUser.save();

    // Generate JWT token with mobileNumber as the key to the profile
    const token = sign({ mobileNumber }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
};



// Update user profile
export const updateProfile =  async (req, res) => {
  const { fullName, profileImage, dob, bloodGroup, gender, abhaId } = req.body;
  const mobileNumber = req.user.mobileNumber;  // Extract mobileNumber from JWT

  try {
    const profile = await Profile.findOne({ mobileNumber });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Update profile fields
    profile.fullName = fullName || profile.fullName;
    profile.profileImage = profileImage || profile.profileImage;
    profile.dob = dob || profile.dob;
    profile.bloodGroup = bloodGroup || profile.bloodGroup;
    profile.gender = gender || profile.gender;
    profile.abhaId = abhaId || profile.abhaId;

    await profile.save();

    res.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};




// Logout user (delete the User model)
export const logOutUser = async (req, res) => {
  const mobileNumber = req.user.mobileNumber;  // Extract mobileNumber from JWT

  try {
    // Delete the User model with the given mobileNumber
    await User.findOneAndDelete({ mobileNumber });

    res.json({ message: 'User logged out and deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log out' });
  }
}




