import { Router } from 'express';
const router = Router();
import { userModal, updateUser } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

router.post("/auth",userModal);
router.put('/auth/update', authMiddleware,updateUser);

export default router;