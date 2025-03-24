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

const TransactionSummaryType = new GraphQLObjectType({
  name: 'TransactionSummary',
  fields: {
    categoryName: { type: GraphQLString },
    totalAmount: { type: GraphQLFloat },
  },
});

export { TransactionType, TransactionSummaryType };
