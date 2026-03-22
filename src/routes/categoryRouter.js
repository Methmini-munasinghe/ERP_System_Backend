import express from 'express';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../controllers/categoryController.js';

const categoryRouter = express.Router(); 

categoryRouter.get('/', getAllCategories);

categoryRouter.get('/:id', getCategoryById);

categoryRouter.post('/', createCategory);

categoryRouter.delete('/:id', deleteCategory);

categoryRouter.put('/:id', updateCategory); 

export default categoryRouter;
