import { GraphQLSchema } from 'graphql';
import { RootQuery } from './resolvers';

export const schema = new GraphQLSchema({
  query: RootQuery,
});
