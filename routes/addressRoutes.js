import { Router } from 'express';
const router = Router();
import { createAddress,listAddresses,updateAddress,setDefaultAddress } from '../controllers/addressController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

router.post("/create",authMiddleware, createAddress);
router.post("/set-default",authMiddleware,setDefaultAddress);
router.get("/list-addresses",authMiddleware,listAddresses);
router.put("/update",authMiddleware, updateAddress);

export default router;