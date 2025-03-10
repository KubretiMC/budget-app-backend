import { GraphQLObjectType } from 'graphql';
import { createWallet, deleteWallet, updateWallet } from './resolvers/walletResolvers';
import { createUser, loginUser } from './resolvers/userResolvers';
import { createCategory, deleteCategory } from './resolvers/categoryResolvers';
import { createTransaction, deleteTransaction, updateTransaction } from './resolvers/transactionResolvers';

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser,
    loginUser,
    createWallet,
    updateWallet,
    deleteWallet,
    createCategory,
    deleteCategory,
    createTransaction,
    updateTransaction,
    deleteTransaction
  },
});
