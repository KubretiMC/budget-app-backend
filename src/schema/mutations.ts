import { GraphQLObjectType } from 'graphql';
import { createWallet } from './resolvers/walletResolvers';
import { createUser } from './resolvers/userResolvers';
import { createCategory } from './resolvers/categoryResolvers';
import { createTransaction } from './resolvers/transactionResolvers';

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createWallet,
    createUser,
    createCategory,
    createTransaction
  },
});
