import { GraphQLObjectType, GraphQLInt, GraphQLString } from 'graphql';

const WalletType = new GraphQLObjectType({
  name: 'Wallet',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    balance: { type: GraphQLInt },
    userId: { type: GraphQLInt },
  }),
});

export default WalletType;
