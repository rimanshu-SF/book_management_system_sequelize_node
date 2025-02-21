import express from 'express';
import asyncHandler from '../utils/asyncHandler';
import { createAuthor, getAllAuthors, getAuthorById, updateAuthor, deleteAuthor } from '../controllers/author.controller';

const router = express.Router();

router.post('/', asyncHandler(createAuthor));  
router.get('/', asyncHandler(getAllAuthors)); 
router.get('/:id', asyncHandler(getAuthorById));
router.patch('/:id', asyncHandler(updateAuthor));
router.delete('/:id', asyncHandler(deleteAuthor));

export { router };
