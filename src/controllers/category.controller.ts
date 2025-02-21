import { Request, Response } from 'express'
import Category from '../models/category.model'
import apiError from '../utils/apiError'

// method to create Category
const createCategory = async (req: Request, res: Response): Promise<void> => {
  const { categoryName } = req.body

  if (!categoryName) {
    throw new apiError(400, 'Category name is required!')
  }

  try {
    const newCategory = await Category.create({ categoryName })

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    })
  } catch (error) {
    throw new apiError(500, 'Server Error')
  }
}

// Get all Categories
const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.findAll()
      .then(() => {
        res.status(200).json({
          success: true,
          data: categories
        })
      })
      .catch((error) => {
        throw new apiError(500, `${error.message}`)
      })
  } catch (error: any) {
    throw new apiError(500, `${error.message}`)
  }
}

// Get a Category by ID
const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  try {
    const category = await Category.findByPk(id)

    if (!category) {
      throw new apiError(404, 'Category not found')
    }

    res.status(200).json({
      success: true,
      data: category
    })
  } catch (error) {
    throw new apiError(500, 'Server Error')
  }
}

// Update a Category by ID
const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const { categoryName } = req.body

  if (!categoryName) {
    throw new apiError(400, 'Category name is required to update')
  }

  try {
    const category = await Category.findByPk(id)

    if (!category) {
      throw new apiError(404, 'Category not found')
    }
    console.log('Categoryof', category)

    // category.dataValues.categoryName = categoryName;
    await category.update({ categoryName: categoryName }, { where: { id: id } })
    const updatedCategory = await Category.findByPk(id)
    console.log('updatedCategory', updatedCategory)

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error
    })
  }
}

// Delete a Category by ID
const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  try {
    const category = await Category.findByPk(id)

    if (!category) {
      throw new apiError(404, 'Category not found')
    }

    await category.destroy()

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error
    })
  }
}

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
}
