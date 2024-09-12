import { Router } from 'express';
import { registerHospital,getAllHospitals,getHospitalById ,approveHospital} from '../controllers/hospitalController.js';


const router = Router();

router.post('/register-hospital', registerHospital);
router.get('/all-hospitals', getAllHospitals);
router.get('/:id', getHospitalById);
router.post('/:hospitalId/approve', approveHospital);
// router.post('/:hospitalId/approve', approveHospital);

export default router;