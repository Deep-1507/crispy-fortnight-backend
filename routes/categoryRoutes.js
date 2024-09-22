import { Router } from 'express';
import {createCategory,getCategories, getCategoriesHome} from '../controllers/categoryController.js';
import { searchCategories } from '../controllers/categoryController.js';


const router = Router();
router.post('/create-category', createCategory);
router.get('/get-categories', getCategories); 
router.get('/get-six-categories', getCategoriesHome); 
router.get('/search', searchCategories);

export default router;