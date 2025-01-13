import { GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLFieldConfig } from 'graphql';
import WalletType from '../types/WalletType';
import Wallet from '../../models/Wallet';

export const createWallet: GraphQLFieldConfig<any, any, { [argName: string]: any }> = {
  type: WalletType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (parent, args) => {
    try {
      const wallet = await Wallet.create({
        name: args.name,
        balance: args.balance,
        userId: args.userId,
      });
      return wallet;
    } catch (error) {
      throw new Error('Error creating wallet');
    }
  },
};
