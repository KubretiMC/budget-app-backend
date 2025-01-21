import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt } from 'graphql';
import WalletType from './types/WalletType';
import Wallet from '../models/Wallet';
import CategoryType from './types/CategoryType';
import Category from '../models/Category';
import { Op } from 'sequelize';

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    wallets: {
      type: new GraphQLList(WalletType),
      resolve() {
        return Wallet.findAll();
      },
    },
    walletsByUserId: {
      type: new GraphQLList(WalletType),
      args: {
        userId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (parent, { userId }) => {
        return Wallet.findAll({ where: { userId } });
      },
    },
    categoriesByUserId: {
      type: new GraphQLList(CategoryType),
      args: {
        userId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (parent, { userId }) => {
        return Category.findAll({
          where: {
            [Op.or]: [
              { userId: null },
              { userId },
            ],
          },
        });
      },
    },
  },
});
