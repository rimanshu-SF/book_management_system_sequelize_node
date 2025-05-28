import { Request, Response } from 'express';
import Author from '../models/author.model';
import Category from '../models/category.model';
import Book from '../models/book.model';
import apiError from '../utils/apiError';
import apiResponse from '../utils/apiResponse';

const getPaginatedBook = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    console.log('Clicked page', page, limit);

    const books = await Book.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Author,
          attributes: ['id', 'name'],
        },
        {
          model: Category,
          attributes: ['id', 'genre'],
        },
      ],
    });

    const totalPages = Math.ceil(books.count / limit);

    const data = {
      totalItems: books.count,
      totalBooks: books.rows.length,
      count: books.count,
      books: books.rows,
      totalPages,
      currentPage: page,
      limit,
    };

    if (data.totalBooks === 0) {
      return res
        .status(200)
        .json(new apiResponse(200, data, `No books for page ${page}`));
    }
    return res.status(200).json(new apiResponse(200, data, 'Books fetched'));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new apiResponse(500, null, 'Error fetching books'));
  }
};

const addBook = async (req: Request, res: Response) => {
  const {
    title,
    isbn,
    price,
    discountPrice,
    publicationDate,
    Author: authorData,
    Category: categoryData,
  } = req.body;

  // console.log('Validation checks:', {
  //   title: !title,
  //   isbn: !isbn,
  //   price: price === undefined,
  //   discountPrice: discountPrice === undefined,
  //   publicationDate: !publicationDate,
  //   authorDataName: !authorData?.name,
  //   categoryDataGenre: !categoryData?.genre,
  //   rawAuthorData: authorData,
  //   rawCategoryData: categoryData,
  // });

  if (
    !title ||
    !isbn ||
    price === undefined ||
    discountPrice === undefined ||
    !publicationDate ||
    !authorData?.name ||
    !categoryData?.genre
  ) {
    throw new apiError(400, 'All fields are required!');
  }

  try {
    const bookExist = await Book.findOne({ where: { title } });
    if (bookExist) {
      return res
        .status(409)
        .json(new apiResponse(409, bookExist, 'Book with this title already exists'));
    }
    // console.log("bookExist",bookExist);
    const isbnExist = await Book.findOne({ where: { isbn } });
    if (isbnExist) {
      return res
        .status(409)
        .json(new apiResponse(409, bookExist, 'Book with this ISBN already exists'));
    }

    const authorExists = await Author.findOne({
      where: { name: authorData.name },
    });
    console.log("Author Exist", authorExists);

    if (!authorExists) {
      throw new apiError(404, 'Author not found');
    }

    const categoryExists = await Category.findOne({
      where: { genre: categoryData.genre },
    });
    if (!categoryExists) {
      throw new apiError(404, 'Category not found');
    }

    const newBook = await Book.create({
      title,
      authorId: authorExists.dataValues.id,
      isbn,
      price,
      discountPrice,
      publicationDate,
      categoryId: categoryExists.dataValues.id,
    });
    // console.log("NewBook", newBook);

    return res
      .status(201)
      .json(new apiResponse(201, newBook, 'Book added successfully'));
  } catch (error) {
    console.error(error);

    if (error instanceof apiError) {
      return res
        .status(error.statusCode)
        .json(new apiResponse(error.statusCode, null, error.message));
    }
    return res
      .status(500)
      .json(new apiResponse(500, null, 'Server side problem'));
  }
};

const getAllBooks = async (req: Request, res: Response) => {
  console.log("get all books");
  
  try {
    const books = await Book.findAll({
      include: [
        {
          model: Author,
          attributes: ['id', 'name']
        },
        {
          model: Category,
          attributes: ['id', 'genre']
        }
      ]
    })


    // console.log('Book by the', books)
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
    const bookExist = await Book.findOne({ where: { title } });
    if (bookExist) {
      return res
        .status(409)
        .json(new apiResponse(409, bookExist, 'Book with this title already exists'));
    }
    console.log("bookExist",bookExist);

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
