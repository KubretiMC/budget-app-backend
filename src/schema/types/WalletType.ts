import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat } from 'graphql';

const WalletType = new GraphQLObjectType({
  name: 'Wallet',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    userId: { type: GraphQLInt },
  }),
});

export default WalletType;
