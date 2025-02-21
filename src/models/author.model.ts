import { sequelize } from '../config/dbConnect'
import { DataTypes } from 'sequelize'

const Author: any = sequelize.define(
  'Author',
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    }
  },
  {
    timestamps: true
  }
)

export default Author
