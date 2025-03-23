import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/dbConnect'; 

class Author extends Model {
  public id!: number; 
  public name!: string;
  public email!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Author.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    sequelize,
    modelName: 'Author',
    tableName: 'Authors',
    timestamps: true,
  }
);

export default Author;