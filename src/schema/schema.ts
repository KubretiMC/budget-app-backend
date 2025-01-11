import { GraphQLSchema } from 'graphql';
import { Mutation } from './mutations';
import { RootQuery } from './RootQuery';

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
