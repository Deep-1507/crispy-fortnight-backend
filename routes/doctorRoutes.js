// routes/doctorRoutes.js
import { Router } from 'express';
import multer from 'multer';
const upload = multer();
import { registerDoctor,getAllDoctors, approveDoctor,getDoctorById, rejectDoctor,checkEmailExists,checkPhoneExists,searchDoctors} from '../controllers/doctorController.js';
const router = Router();

router.post('/register',upload.none(), registerDoctor);
router.get('/all', getAllDoctors);
router.post("/check-email", checkEmailExists);
router.post("/check-phone", checkPhoneExists);
router.get('/search-doctors', searchDoctors);
router.post('/:id/approve', approveDoctor);
router.post('/:id/reject', rejectDoctor )
router.get('/:id', getDoctorById);




export default router;
