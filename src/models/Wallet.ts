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
  declare deletedAt: Date | null;
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
      type: DataTypes.FLOAT,
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
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: 'Wallet',
    timestamps: false,
    paranoid: true
  }
);

export default Wallet;
