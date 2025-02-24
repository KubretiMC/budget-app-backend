import { GraphQLNonNull, GraphQLString, GraphQLFieldConfig } from 'graphql';
import CategoryType from '../types/CategoryType';
import Category from '../../models/Category';
import { authenticateUser } from '../../auth/authenticate';

export const createCategory: GraphQLFieldConfig<any, any, { [argName: string]: any }> = {
  type: CategoryType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: GraphQLString },
  },
  resolve: async (parent, args, context) => {
    try {
      await authenticateUser(context.request.headers.authorization);
      const category = await Category.create({
        name: args.name,
        userId: args.userId,
      });
      return category;
    } catch (error) {
      throw new Error(`Error creating category: ${error.message}`);
    }
  },
};
