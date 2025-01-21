import { GraphQLObjectType, GraphQLInt, GraphQLString } from 'graphql';

const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        userId: { type: GraphQLInt },
    }),
});

export default CategoryType;
