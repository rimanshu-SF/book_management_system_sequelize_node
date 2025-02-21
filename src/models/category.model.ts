import { sequelize } from '../config/dbConnect'
import { DataTypes } from 'sequelize'

const Category = sequelize.define('Category', {
  categoryName: {
    type: DataTypes.STRING,
    allowNull: false
  }
})


export default Category
