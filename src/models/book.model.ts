import { DataTypes } from 'sequelize'
import { sequelize } from '../config/dbConnect'
import Author from './author.model'
import Category from './category.model'

const Book = sequelize.define(
  'Book',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Author,
        key: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false
    },
    publicationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    discountPrice: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: 'id'
      },
      onUpdate: 'CASCADE'
    },
    view: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    freezeTableName: true,
    timestamps: true
  }
)

export default Book
