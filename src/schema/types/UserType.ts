import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLInt },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

export default UserType;
