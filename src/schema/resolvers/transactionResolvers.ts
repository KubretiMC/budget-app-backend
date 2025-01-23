import { GraphQLNonNull, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLFieldConfig } from 'graphql';
import TransactionType from '../types/TransactionType';
import Transaction from '../../models/Transaction';

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
    try {
      const transaction = await Transaction.create({
        userId: args.userId,
        walletId: args.walletId,
        amount: args.amount,
        categoryId: args.categoryId,
        notes: args.notes,
        date: args.date,
      });
      return transaction;
    } catch (error: any) {
      throw new Error(`Error creating transaction: ${error.message}`);
    }
  },
};
