import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../db/connect';

class Wallet extends Model<
  InferAttributes<Wallet>,
  InferCreationAttributes<Wallet, { omit: 'id' }>
> {
  declare id: string;
  declare name: string;
  declare balance: number;
  declare userId: string;
  declare deletedAt: Date | null;
}

Wallet.init(
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
    balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
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
    tableName: 'wallets',
    timestamps: false,
    paranoid: true
  }
);

export default Wallet;
