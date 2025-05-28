import { Request, Response } from 'express'
import Author from '../models/author.model'
import apiError from '../utils/apiError'

// Create a new author
const createAuthor = async (req: Request, res: Response) => {
  const { name, email } = req.body

  if (!name || !email) {
    throw new apiError(400, 'Name and email are required!')
  }

  try {
    const existingAuthor = await Author.findOne({ where: { email } })
    if (existingAuthor) {
      throw new apiError(409, 'Author with this email already exists!')
    }
    const newAuthor = await Author.create({
      name,
      email
    })

    return res.status(201).json({
      success: true,
      message: 'Author created successfully',
      data: newAuthor
    })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ success: false, message: 'Server side error' })
  }
}

// Get all authors
const getAllAuthors = async (req: Request, res: Response) => {
  try {
    const authors = await Author.findAll()
    return res.status(200).json({
      success: true,
      data: authors
    })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ success: false, message: 'Server side error' })
  }
}

// Get author by ID
const getAuthorById = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const author = await Author.findByPk(id)
    if (!author) {
      return res
        .status(404)
        .json({ success: false, message: 'Author not found' })
    }
    return res.status(200).json({
      success: true,
      data: author
    })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ success: false, message: 'Server side error' })
  }
}

// Update an author by ID
const updateAuthor = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, email } = req.body
  if (!name && !email) {
    return res.status(400).json({
      success: false,
      message: 'At least one field is required to update!'
    })
  }

  try {
    const author = await Author.findByPk(id)
    if (!author) {
      return res
        .status(404)
        .json({ success: false, message: 'Author not found' })
    }
    console.log('Author from update', author)

    if (name) author.name = name;
    if (email) author.email = email

    await author.save()

    return res.status(200).json({
      success: true,
      message: 'Author updated successfully',
      data: author
    })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ success: false, message: 'Server side error' })
  }
}

// Delete an author by ID
const deleteAuthor = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const author = await Author.findByPk(id)
    if (!author) {
      return res
        .status(404)
        .json({ success: false, message: 'Author not found' })
    }

    await author.destroy()

    return res.status(200).json({
      success: true,
      message: 'Author deleted successfully'
    })
  } catch (error) {
    console.log("Error from delete author",error)
    return res
      .status(500)
      .json({ success: false, message: 'Server side error' })
  }
}

export {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor
}
