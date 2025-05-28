import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/dbConnect';

interface UserAttributes {
  id?: number;
  googleId: string;
  name: string;
  email: string;
  profilePhoto?: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public googleId!: string;
  public name!: string;
  public email!: string;
  public profilePhoto?: string;
}

User.init(
  {
    googleId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    timestamps: true,
  }
);

export default User;
