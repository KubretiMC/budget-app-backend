import { GraphQLObjectType } from 'graphql';
import { createWallet } from './resolvers/walletResolvers';
import { createUser } from './resolvers/createUser';

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createWallet,
    createUser,
  },
});
