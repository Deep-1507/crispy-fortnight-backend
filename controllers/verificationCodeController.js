import { Router } from 'express';
const router = Router();
import { randomInt } from 'crypto';
import nodemailer from 'nodemailer'
import verificationCodeModel from '../models/verificationCodeModel.js';
// Nodemailer setup (using Gmail here for example)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Replace with your SMTP host
    port: 587, // or 465 for secure connections
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'uv84690@gmail.com', // Your email
      pass: 'lvwpefogwgqfxiox', // Your email password
    },
  });

// POST route to send verification code
export const sendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Generate a 6-digit random verification code
    const verificationCode = randomInt(100000, 999999).toString();

    // Save the verification code in the database
    await verificationCodeModel.findOneAndUpdate(
      { email }, 
      { email, code: verificationCode }, 
      { upsert: true, new: true }
    );

    // Send email with Nodemailer
    const mailOptions = {
      from: 'uv84690@gmail.com',
      to: email,
      subject: 'Your Email Verification Code',
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Verification code sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending verification code' });
  }
}

// POST route to verify the code
export const emailVerify = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code are required' });
  }

  try {
    // Fetch the verification code from the database
    const storedCode = await verificationCodeModel.findOne({ email });

    if (storedCode && storedCode.code === code) {
      // Code verified successfully, remove the verification entry from the database
      await verificationCodeModel.deleteOne({ email });
      return res.status(200).json({ message: 'Verification successful' });
    } else {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error verifying code' });
  }
}
export default router;
