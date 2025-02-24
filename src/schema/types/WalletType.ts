import { GraphQLObjectType, GraphQLString, GraphQLFloat } from 'graphql';

const WalletType = new GraphQLObjectType({
  name: 'Wallet',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    userId: { type: GraphQLString },
  }),
});

export default WalletType;
