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
      await t.rollback();
      throw new Error(`Error creating transaction: ${error.message}`);
    }
  },
};

export const updateTransaction: GraphQLFieldConfig<any, any, { [argName: string]: any }> = {
  type: TransactionType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    walletId: { type: new GraphQLNonNull(GraphQLInt) },
    amount: { type: new GraphQLNonNull(GraphQLFloat) },
    categoryId: { type: new GraphQLNonNull(GraphQLInt) },
    notes: { type: GraphQLString },
    date: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    const { id, walletId, amount, categoryId, notes, date } = args;
    const t = await sequelize.transaction();
    try {
      const existingTransaction = await Transaction.findByPk(id, { transaction: t });
      if (!existingTransaction) {
        throw new Error(`Transaction with ID ${id} not found.`);
      }

      const isWalletChanged = existingTransaction.walletId !== walletId;
      const oldWallet = await Wallet.findByPk(existingTransaction.walletId, { transaction: t });
      const newWallet = await Wallet.findByPk(walletId, { transaction: t });

      if (!oldWallet || !newWallet) {
        throw new Error(`One of the wallets was not found.`);
      }

      if (isWalletChanged) {
        await oldWallet.update({ balance: oldWallet.balance - existingTransaction.amount }, { transaction: t });
        await newWallet.update({ balance: newWallet.balance + amount }, { transaction: t });
      } else {
        await oldWallet.update({ balance: oldWallet.balance - existingTransaction.amount + amount }, { transaction: t });
      }

      const updatedTransaction = await existingTransaction.update(
        { walletId, amount, categoryId, notes, date },
        { transaction: t }
      );
      await t.commit();
      return updatedTransaction;
    } catch (error: any) {
      await t.rollback();
      throw new Error(`Error updating transaction: ${error.message}`);
    }
  },
};
