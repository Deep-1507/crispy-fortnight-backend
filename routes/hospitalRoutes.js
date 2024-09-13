import { Router } from 'express';
import { registerHospital,getAllHospitals,getHospitalById ,approveHospital,searchHospitals} from '../controllers/hospitalController.js';


const router = Router();


router.post('/register-hospital', registerHospital);
router.get('/all-hospitals', getAllHospitals);

// Place search route above the dynamic `:id` route to avoid conflicts
router.get('/search-hospitals', searchHospitals);

router.get('/:id', getHospitalById);
router.post('/:hospitalId/approve', approveHospital);

export default router;