import { GraphQLObjectType, GraphQLString } from 'graphql';

const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        userId: { type: GraphQLString },
    }),
});

export default CategoryType;
