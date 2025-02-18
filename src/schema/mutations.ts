import { GraphQLObjectType } from 'graphql';
import { createWallet, deleteWallet, updateWallet } from './resolvers/walletResolvers';
import { createUser, loginUser } from './resolvers/userResolvers';
import { createCategory } from './resolvers/categoryResolvers';
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
    createTransaction,
    updateTransaction,
    deleteTransaction
  },
});
