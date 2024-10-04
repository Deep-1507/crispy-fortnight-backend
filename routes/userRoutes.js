import { Router } from 'express';
const router = Router();
import { userModal, updateUser, getUserDetails, getUserByfid } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

router.post("/auth",userModal);
router.put('/auth/update', authMiddleware,updateUser);
router.get('/get-user', authMiddleware, getUserDetails);
router.get("/get",getUserByfid);

export default router;