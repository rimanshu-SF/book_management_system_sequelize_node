import express from 'express'
import {
  addBook,
  bulkAddBook,
  deleteBook,
  getAllBooks,
  getBookById,
  getPaginatedBook,
  updateBook
} from '../controllers/book.controller'
import asyncHandler from '../utils/asyncHandler'

const router = express.Router()

router.get('/paginated', asyncHandler(getPaginatedBook))
router.post('/', asyncHandler(addBook))
router.get('/', asyncHandler(getAllBooks))
router.get('/:id', asyncHandler(getBookById))
router.patch('/:id', asyncHandler(updateBook))
router.delete('/:id', asyncHandler(deleteBook))
router.post('/bulk', asyncHandler(bulkAddBook))

export { router }
