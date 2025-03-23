import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/dbConnect'; 

class Category extends Model {
  public id!: number; 
  public genre!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
  {
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'Categories',
    timestamps: true,
  }
);

export default Category;