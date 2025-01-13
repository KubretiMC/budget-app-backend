import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../db/connect';

class Wallet extends Model<
  InferAttributes<Wallet>,
  InferCreationAttributes<Wallet, { omit: 'id' }>
> {
  declare id: number;
  declare name: string;
  declare balance: number;
  declare userId: number;
}

Wallet.init(
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
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Wallet',
    timestamps: false,
  }
);

export default Wallet;
