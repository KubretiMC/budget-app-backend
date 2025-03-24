import {
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLString,
  GraphQLFieldConfig,
} from 'graphql';
import { TransactionType } from '../types/TransactionType';
import Transaction from '../../models/Transaction';
import Wallet from '../../models/Wallet';
import { sequelize } from '../../db/connect';
import { authenticateUser } from '../../auth/authenticate';
import { MyContext } from '../types/MyContext';

export const createTransaction: GraphQLFieldConfig<unknown, MyContext, { [argName: string]: any }> = {
  type: TransactionType,
  args: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    walletId: { type: new GraphQLNonNull(GraphQLString) },
    amount: { type: new GraphQLNonNull(GraphQLFloat) },
    categoryId: { type: new GraphQLNonNull(GraphQLString) },
    notes: { type: GraphQLString },
    date: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args, context) => {
    const { userId, walletId, amount, categoryId, notes, date } = args;
    const t = await sequelize.transaction();
    try {
      await authenticateUser(context.request.headers.authorization);
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
    } catch (error) {
      await t.rollback();
      throw new Error(`Error creating transaction: ${error.message}`);
    }
  },
};

export const updateTransaction: GraphQLFieldConfig<unknown, MyContext, { [argName: string]: any }> = {
  type: TransactionType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    walletId: { type: new GraphQLNonNull(GraphQLString) },
    amount: { type: new GraphQLNonNull(GraphQLFloat) },
    categoryId: { type: new GraphQLNonNull(GraphQLString) },
    notes: { type: GraphQLString },
    date: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args, context) => {
    const { id, walletId, amount, categoryId, notes, date } = args;
    const t = await sequelize.transaction();
    try {
      await authenticateUser(context.request.headers.authorization);
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
    } catch (error) {
      await t.rollback();
      throw new Error(`Error updating transaction: ${error.message}`);
    }
  },
};

export const deleteTransaction: GraphQLFieldConfig<unknown, MyContext, { [argName: string]: any }> = {
  type: TransactionType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_parent, args, context) => {
    const { id } = args;
    const t = await sequelize.transaction();
    try {
      await authenticateUser(context.request.headers.authorization);
      const transaction = await Transaction.findByPk(id, { transaction: t });
      if (!transaction) {
        throw new Error(`Transaction with ID ${id} not found.`);
      }
      const wallet = await Wallet.findByPk(transaction.walletId, { transaction: t });
      if (!wallet) {
        throw new Error(`Wallet with ID ${transaction.walletId} not found.`);
      }
      await wallet.update(
        { balance: wallet.balance - transaction.amount },
        { transaction: t }
      );
      transaction.deletedAt = new Date();
      await transaction.save({ transaction: t });
      await t.commit();
      return transaction;
    } catch (error) {
      await t.rollback();
      throw new Error(`Error deleting transaction: ${error.message}`);
    }
  },
};
