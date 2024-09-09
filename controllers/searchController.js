import  Doctor from '../models/doctorModel.js';
import Hospital from '../models/hospitalModel.js';

export const search =  async (req, res) => {
    const query = req.query.query || '';
  
    try {
      // Search for doctors
      const doctors = await Doctor.find({
        $or: [
          { doctorName: { $regex: query, $options: 'i' } },
          { specialization: { $regex: query, $options: 'i' } },
        ],
      });
  
      // Search for hospitals
      const hospitals = await Hospital.find({
        $or: [
          { hospitalName: { $regex: query, $options: 'i' } },
          { specialization: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
        ],
      });
  
      res.json({ doctors, hospitals });
    } catch (error) {
      console.error('Error fetching search results:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }