
import { Router } from 'express';
const router = Router();
import { search } from '../controllers/searchController.js';

router.get('/search', search);
// Search endpoint


export default router;
