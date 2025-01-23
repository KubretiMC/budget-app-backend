import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat } from 'graphql';

const TransactionType = new GraphQLObjectType({
  name: 'Transaction',
  fields: () => ({
    id: { type: GraphQLInt },
    userId: { type: GraphQLInt },
    walletId: { type: GraphQLInt },
    amount: { type: GraphQLFloat },
    categoryId: { type: GraphQLInt },
    notes: { type: GraphQLString },
    date: { type: GraphQLString },
  }),
});

export default TransactionType;
