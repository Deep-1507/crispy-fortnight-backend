import { Router } from 'express';
const router = Router();
import { sendVerificationEmail, emailVerify} from '../controllers/verificationCodeController.js';

router.post('/send-verification-code', sendVerificationEmail);
router.post('/verify-code', emailVerify);

// Search endpoint


export default router;