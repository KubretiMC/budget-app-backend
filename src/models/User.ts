import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../db/connect';

class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User, { omit: 'id' }> 
> {
  declare id: number;
  declare username: string;
  declare password: string;
  declare email: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);

export default User;
