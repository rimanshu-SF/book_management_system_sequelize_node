import { sequelize } from './dbConnect'
import Book from '../models/book.model'
import Author from '../models/author.model'
import Category from '../models/category.model'

export function defineAssociations() {
  Book.belongsTo(Author, { foreignKey: 'authorId' })
  Author.hasMany(Book, { foreignKey: 'authorId' })
  Book.belongsTo(Category, { foreignKey: 'categoryId' })
  Category.hasMany(Book, { foreignKey: 'categoryId' })
}
