import { GraphQLObjectType, GraphQLString, GraphQLFloat } from 'graphql';

const TransactionType = new GraphQLObjectType({
  name: 'Transaction',
  fields: () => ({
    id: { type: GraphQLString },
    userId: { type: GraphQLString },
    walletId: { type: GraphQLString },
    amount: { type: GraphQLFloat },
    categoryId: { type: GraphQLString },
    notes: { type: GraphQLString },
    date: { type: GraphQLString },
  }),
});

export default TransactionType;
