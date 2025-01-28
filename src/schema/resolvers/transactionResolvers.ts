import {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLFieldConfig,
} from 'graphql';
import TransactionType from '../types/TransactionType';
import Transaction from '../../models/Transaction';
import Wallet from '../../models/Wallet';
import { sequelize } from '../../db/connect';

export const createTransaction: GraphQLFieldConfig<any, any, { [argName: string]: any }> = {
  type: TransactionType,
  args: {
    userId: { type: new GraphQLNonNull(GraphQLInt) },
    walletId: { type: new GraphQLNonNull(GraphQLInt) },
    amount: { type: new GraphQLNonNull(GraphQLFloat) },
    categoryId: { type: new GraphQLNonNull(GraphQLInt) },
    notes: { type: GraphQLString },
    date: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    const { userId, walletId, amount, categoryId, notes, date } = args;
    const t = await sequelize.transaction();
    try {
      const wallet = await Wallet.findByPk(walletId, { transaction: t });
      if (!wallet) {
        throw new Error(`Wallet with ID ${walletId} not found.`);
      }
      const newBalance = wallet.balance + amount;
      await wallet.update({ balance: newBalance }, { transaction: t });
      const transaction = await Transaction.create(
        {
          userId,
          walletId,
          amount,
          categoryId,
          notes,
          date,
        },
        { transaction: t }
      );
      await t.commit();
      return transaction;
    } catch (error: any) {
      throw new Error(`Error creating transaction: ${error.message}`);
    }
  },
};
