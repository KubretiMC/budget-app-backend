import { GraphQLNonNull, GraphQLString, GraphQLFieldConfig } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserType from '../types/UserType';
import User from '../../models/User';
import { GraphQLObjectType as GraphQLObj } from 'graphql';
import Wallet from '../../models/Wallet';
import { MyContext } from '../types/MyContext';
import { Op } from 'sequelize';

export const createUser: GraphQLFieldConfig<unknown, MyContext, { [argName: string]: any }> = {
  type: UserType,
  args: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    try {
      const existingUser = await User.findOne({ 
        where: { 
          [Op.or]: [{ email: args.email }, { username: args.username }] 
        } 
      });
      
      if (existingUser) {
        throw new Error('Email or username already in use');
      }      
      const hashedPassword = await bcrypt.hash(args.password, 10);
      const user = await User.create({
        username: args.username,
        password: hashedPassword,
        email: args.email,
      });
      await Wallet.create({
        name: `Wallet 1`,
        balance: 0,
        userId: user.id,
      });

      return user;
    } catch (error) {
      throw new Error(error.message || `Unexpected error occurred.`);
    }
  },
};

export const loginUser: GraphQLFieldConfig<unknown, MyContext, { [argName: string]: any }> = {
  type: new GraphQLObj({
    name: 'AuthPayload',
    fields: () => ({
      token: { type: GraphQLString },
      user: { type: UserType },
    }),
  }),
  args: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    try {
      if (!process.env.SECRET_KEY) {
        throw new Error('Missing SECRET_KEY in environment variables');
      }

      const user = await User.findOne({ where: { username: args.username } });
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      const isValidPassword = await bcrypt.compare(args.password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '12h' });
      return { token, user };
    } catch (error) {
      throw new Error(`Error logging in ${error.message}`);
    }
  },
};