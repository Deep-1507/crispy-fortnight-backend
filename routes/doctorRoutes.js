// routes/doctorRoutes.js
import { Router } from 'express';
import { registerDoctor,getAllDoctors, approveDoctor,getDoctorById, rejectDoctor} from '../controllers/doctorController.js';
const router = Router();
router.post('/register', registerDoctor);
router.get('/all', getAllDoctors);
router.post('/:id/approve', approveDoctor);
router.post('/:id/reject', rejectDoctor )
router.get('/:id', getDoctorById);

export default router;
