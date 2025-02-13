import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../db/connect';

class Transaction extends Model<
  InferAttributes<Transaction>,
  InferCreationAttributes<Transaction, { omit: 'id' }>
> {
  declare id: number;
  declare userId: number;
  declare walletId: number;
  declare amount: number;
  declare categoryId: number;
  declare notes: string;
  declare date: Date;
  declare deletedAt: Date | null;
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    walletId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Wallets',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id',
      },
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: 'Transaction',
    timestamps: false,
  }
);

export default Transaction;
