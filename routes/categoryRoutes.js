import { Router } from 'express';
import {createCategory,getCategories} from '../controllers/categoryController.js';
import { searchCategories } from '../controllers/categoryController.js';


const router = Router();
router.post('/create-category', createCategory);
router.get('/get-categories', getCategories); 
router.get('/search', searchCategories);

export default router;