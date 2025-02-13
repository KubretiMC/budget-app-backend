import { GraphQLObjectType } from 'graphql';
import { createWallet, deleteWallet, updateWallet } from './resolvers/walletResolvers';
import { createUser } from './resolvers/userResolvers';
import { createCategory } from './resolvers/categoryResolvers';
import { createTransaction, deleteTransaction, updateTransaction } from './resolvers/transactionResolvers';

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createWallet,
    updateWallet,
    deleteWallet,
    createUser,
    createCategory,
    createTransaction,
    updateTransaction,
    deleteTransaction
  },
});
