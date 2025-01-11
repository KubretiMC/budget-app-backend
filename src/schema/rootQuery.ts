import { GraphQLObjectType, GraphQLList } from 'graphql';
import WalletType from './types/WalletType';
import Wallet from '../models/Wallet';

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    wallets: {
      type: new GraphQLList(WalletType),
      resolve() {
        return Wallet.findAll();
      },
    },
  },
});
