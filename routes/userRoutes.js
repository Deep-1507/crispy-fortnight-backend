
import { Router } from 'express';
const router = Router();
import { loginUser, updateProfile,logOutUser } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

router.post('/login', loginUser);
router.put('/userProfile', authMiddleware,  updateProfile);
router.post('/logout', authMiddleware,  logOutUser);



export default router;
