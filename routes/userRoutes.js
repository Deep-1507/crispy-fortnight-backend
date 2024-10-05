import { Router } from 'express';
const router = Router();
import { userModal, updateUser, getUserDetails, getUserByfid,userModal2,createUser } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


router.post("/auth",userModal);
router.put('/auth/update', authMiddleware,updateUser);
router.post('/create', createUser);
router.get('/get-user', authMiddleware, getUserDetails);
router.get("/get",getUserByfid);
router.post("/auth1",userModal2);

export default router;