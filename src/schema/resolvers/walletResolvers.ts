import { GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLFieldConfig, GraphQLFloat } from 'graphql';
import WalletType from '../types/WalletType';
import Wallet from '../../models/Wallet';
import { authenticateUser } from '../../auth/authenticate';

export const createWallet: GraphQLFieldConfig<any, any, { [argName: string]: any }> = {
  type: WalletType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    userId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (parent, args, context) => {
    try {
      await authenticateUser(context.request.headers.authorization);
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

export const updateWallet: GraphQLFieldConfig<any, any, { [argName: string]: any }> = {
  type: WalletType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
  resolve: async (parent, args, context) => {
    try {
      await authenticateUser(context.request.headers.authorization);

      const wallet = await Wallet.findByPk(args.id);
      if (!wallet) throw new Error('Wallet not found');

      if (args.name !== undefined) wallet.name = args.name;
      if (args.balance !== undefined) wallet.balance = args.balance;

      await wallet.save();
      return wallet;
    } catch (error) {
      throw new Error('Error updating wallet');
    }
  },
};

export const deleteWallet: GraphQLFieldConfig<any, any, { [argName: string]: any }> = {
  type: WalletType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (parent, args, context) => {
    try {
      await authenticateUser(context.request.headers.authorization);
      const wallet = await Wallet.findByPk(args.id);
      if (!wallet) throw new Error('Wallet not found');

      wallet.deletedAt = new Date();
      await wallet.save();
      return wallet;
    } catch (error) {
      throw new Error('Error deleting wallet');
    }
  },
};
