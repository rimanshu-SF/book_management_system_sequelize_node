import express from 'express';
import asyncHandler from '../utils/asyncHandler';
// import { createAuthor, getAllAuthors, getAuthorById, updateAuthor, deleteAuthor } from '../controllers/author.controller';
import { createCategory, getAllCategories, getCategoryById, deleteCategory, updateCategory } from '../controllers/category.controller';
const router = express.Router();

router.post('/', asyncHandler(createCategory));  
router.get('/', asyncHandler(getAllCategories));
router.get('/:id', asyncHandler(getCategoryById));
router.put('/:id', asyncHandler(updateCategory));
router.delete('/:id', asyncHandler(deleteCategory));

export { router };
