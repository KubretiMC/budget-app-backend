import {
    GraphQLObjectType,
    GraphQLList,
    GraphQLInt,
    GraphQLString,
  } from 'graphql';
  
  const WalletType = new GraphQLObjectType({
    name: 'Wallet',
    fields: () => ({
      id: { type: GraphQLInt },
      name: { type: GraphQLString },
      balance: { type: GraphQLInt },
    }),
  });
  
  export const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      wallets: {
        type: new GraphQLList(WalletType),
        resolve() {
          return [
            { id: 1, name: 'Main Wallet', balance: 1000 },
            { id: 2, name: 'Savings', balance: 5000 },
          ];
        },
      },
    },
  });
  