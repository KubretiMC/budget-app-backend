import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../db/connect';

class Category extends Model<
  InferAttributes<Category>,
  InferCreationAttributes<Category, { omit: 'id' }>
> {
  declare id: number;
  declare name: string;
  declare userId: number | null;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Category',
    timestamps: false,
  }
);

export default Category;
