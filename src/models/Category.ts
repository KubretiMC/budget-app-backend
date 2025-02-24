import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../db/connect';

class Category extends Model<
  InferAttributes<Category>,
  InferCreationAttributes<Category, { omit: 'id' }>
> {
  declare id: string;
  declare name: string;
  declare userId: string | null;
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
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
