import { Request, Response } from 'express'
import Author from '../models/author.model'
import Category from '../models/category.model'
import Book from '../models/book.model'
import apiError from '../utils/apiError'
import apiResponse from '../utils/apiResponse'

const getPaginatedBook = async (req: Request, res: Response) => {
  console.log('Clicked page')

  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const offset = (page - 1) * limit
    console.log('Clicked page', page, limit)

    const books = await Book.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Author,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Category,
          attributes: ['id', 'categoryName']
        }
      ]
    })

    const totalPages = Math.ceil(books.count / limit)

    const data = {
      totalItems: books.count,
      totalBooks: books.rows.length,
      count: books.count,
      books: books.rows,
      totalPages: totalPages,
      currentPage: page,
      limit: limit
    }
    if (data.totalBooks === 0) {
      return res
        .status(200)
        .json(new apiResponse(200, data, `No Book for page ${page}`))
    }
    return res.status(200).json(new apiResponse(200, data, 'Books Fetched'))
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error fetching books' })
  }
}

const addBook = async (req: Request, res: Response) => {
  const {
    title,
    isbn,
    price,
    discountPrice,
    publicationDate,
    authorId,
    categoryId
  } = req.body

  if (
    !title ||
    !isbn ||
    !price ||
    !discountPrice ||
    !publicationDate ||
    !categoryId ||
    !authorId
  ) {
    throw new apiError(400, 'All Fields are Required!')
  }

  try {
    const bookExist = await Book.findOne({ where: { title: title } })
    console.log('Book Existence', bookExist)
    if (bookExist) {
      return res
        .status(402)
        .json(
          new apiResponse(402, bookExist, 'Book with this title already exist')
        )
    }
    const authorExists = await Author.findOne({ where: { id: authorId } })
    if (!authorExists) {
      throw new apiError(404, 'Author not found')
    }

    const categoryExists = await Category.findOne({ where: { id: categoryId } })
    if (!categoryExists) {
      throw new apiError(404, 'Category not found')
    }

    // Create the book
    const newBook = await Book.create({
      title,
      authorId,
      isbn,
      price,
      discountPrice,
      publicationDate,
      categoryId
    })

    // Return success response with created book data
    return res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: newBook
    })
  } catch (error) {
    console.log(error)

    // Handle Sequelize errors and others
    if (error instanceof apiError) {
      throw error
    } else {
      throw new apiError(500, 'Server side problem')
    }
  }
}

const getAllBooks = async (req: Request, res: Response) => {
  console.log("get all books");
  
  try {
    const books = await Book.findAll({
      include: [
        {
          model: Author,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Category,
          attributes: ['id', 'categoryName']
        }
      ]
    })


    console.log('Book by the', books)
    if (books && books.length > 0) {
      return res
        .status(202)
        .json(new apiResponse(200, books, 'All books fetched'))
    } else {
      return res.status(404).json(new apiResponse(404, null, 'No books found'))
    }
  } catch (error) {
    throw new apiError(500, 'Server side problem!')
  }
}

const getBookById = async (req: Request, res: Response) => {
  const { id } = req.params
  console.log('ID from book', id)
  try {
    const book = await Book.findByPk(id, {
      include: [
        {
          model: Author,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Category,
          attributes: ['id', 'categoryName']
        }
      ]
    })
    if (book) {
      return res.status(202).json(new apiResponse(202, book, 'Book Fetch'))
    }
  } catch (error) {
    console.log(error)
    throw new apiError(400, 'Error during getting book')
  }
}

const updateBook = async (req: Request, res: Response) => {
  const { id } = req.params
  const { title, price, discountPrice, publicationDate } = req.body

  // Validate at least one field
  if (!title && !price && !discountPrice && !publicationDate) {
    return res.status(400).json({
      success: false,
      message: 'At least one field is required to update!'
    })
  }

  try {
    const book = await Book.findByPk(id)

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book Not Found!'
      })
    }
    if (title) book.set('title', title)
    if (price !== undefined) book.set('price', price)
    if (discountPrice !== undefined) book.set('discountPrice', discountPrice)
    if (publicationDate) book.set('publicationDate', publicationDate)

    await book.save()

    return res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Problem in updating book'
    })
  }
}

const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    // const deleteBook = await Book.findByPk(id)
    // if (deleteBook) {
    // await deleteBook.destroy();
    await Book.destroy({
      where: {
        id: id
      }
    })
      .then(() => {
        return res
          .status(200)
          .json(new apiResponse(200, null, 'Book deleted successfully'))
      })
      .catch((error) => {
        throw new apiError(505, 'Cannot delete book')
      })
  } catch (error) {
    throw new apiError(505, 'Problem in delete book')
  }
}

export {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  getPaginatedBook
}
