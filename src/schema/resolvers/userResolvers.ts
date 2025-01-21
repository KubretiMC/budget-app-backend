import { GraphQLNonNull, GraphQLString, GraphQLFieldConfig } from 'graphql';
import UserType from '../types/UserType';
import User from '../../models/User';

export const createUser: GraphQLFieldConfig<any, any, { [argName: string]: any }> = {
  type: UserType,
  args: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    try {
      const user = await User.create({
        username: args.username,
        password: args.password,
        email: args.email,
      });
      return user;
    } catch (error) {
      throw new Error('Error creating user');
    }
  },
};
