import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import WalletType from './types/WalletType';
import Wallet from '../models/Wallet';
import CategoryType from './types/CategoryType';
import Category from '../models/Category';
import { Op, Sequelize, WhereOptions } from 'sequelize';
import TransactionType from './types/TransactionType';
import Transaction from '../models/Transaction';
import { authenticateUser } from '../auth/authenticate';
import UserType from './types/UserType';
import User from '../models/User';

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    walletsByUserId: {
      type: new GraphQLList(WalletType),
      args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args, context) => {
        try {
          await authenticateUser(context.request.headers.authorization);
          return await Wallet.findAll({
            where: { 
              userId: args.userId, 
              deletedAt: null
            },
            attributes: ['id', 'name', 'balance', 'userId'],
          });
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
    categoriesByUserId: {
      type: new GraphQLList(CategoryType),
      args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, { userId }, context) => {
        try {
          await authenticateUser(context.request.headers.authorization);
          return Category.findAll({
            where: {
              [Op.or]: [
                { userId: null },
                { userId },
              ],
              deletedAt: null
            },
            order: [[Sequelize.literal("userId IS NOT NULL"), "ASC"]],
          });
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
    transactionsByUserId: {
      type: new GraphQLList(TransactionType),
      args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        filterType: { type: GraphQLString },
      },
      resolve: async (parent, { userId, filterType }, context) => {
        try {
          await authenticateUser(context.request.headers.authorization);
          const whereClause: WhereOptions = {
            userId,
            deletedAt: null,
          };
        
          if (filterType === 'expenses') {
            whereClause.amount = { [Op.lt]: 0 };
          } else if (filterType === 'incomes') {
            whereClause.amount = { [Op.gt]: 0 };
          }
        
          return Transaction.findAll({
            where: whereClause,
            paranoid: true,
            order: [['date', 'DESC']],
          });
        } catch (error) {
          throw new Error(error.message);
        }
      }
    },
    getUser: {
      type: UserType,
      resolve: async (parent, args, context) => {
        try {
          const user = await authenticateUser(context.request.headers.authorization);
          if (!user) {
            throw new Error("User not authenticated");
          }
          return await User.findByPk(user.id, {
            attributes: ['id'],
          });
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
  },
});
