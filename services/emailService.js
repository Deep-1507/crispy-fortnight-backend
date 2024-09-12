
import nodemailer from 'nodemailer';


// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Replace with your SMTP host
  port: 587, // or 465 for secure connections
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'khyatig0206@gmail.com', // Your email
    pass: 'xkdlxsfjwdaugtmw', // Your email password
  },
  tls: {
    rejectUnauthorized: false, // Add this to prevent SSL certificate validation issues
  },
  connectionTimeout: 2 * 60 * 1000,  // Increase connection timeout to 2 minutes
});


// Function to send approval email
export const sendApprovalEmail = async (doctor) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: doctor.email, // Recipient's email
    subject: 'Doctor Registration Approved',
    text: `Dear Dr. ${doctor.doctorName},

Your registration has been approved successfully.

Thank you,
Docso Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Approval email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


export const sendRejectionEmail = async (doctor, customMessage) => {

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: doctor.email, // Doctor's email
    subject: "Rejection of Doctor Application",
    text: `Dear Dr. ${doctor.doctorName},

    We regret to inform you that your application has been rejected.

    Reason: ${customMessage}

    Best regards,
    Docso Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Rejection email sent successfully to", doctor.email);
  } catch (error) {
    console.error("Error sending rejection email:", error);
    throw new Error("Error sending rejection email");
  }
};


// Function to send approval email to hospital
export const sendApprovalHospital = async (hospital) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: hospital.email, // Ensure this field is valid in the hospital document
    subject: `${hospital.institutionType} Registration Approved`,
    text: `Request for Registration of ${hospital.institutionType} ${hospital.hospitalName} Approved,

Your registration has been approved successfully.
Here is your ${hospital.institutionType} Registration ID: ${hospital.hospitalId}

Thank you,
Docso Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Approval email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send approval email');
  }
};
