import { GraphQLObjectType } from 'graphql';
import { createWallet } from './resolvers/walletResolvers';

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createWallet,
  },
});
