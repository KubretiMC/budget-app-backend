import { GraphQLNonNull, GraphQLString, GraphQLFieldConfig } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserType from '../types/UserType';
import User from '../../models/User';
import { GraphQLObjectType as GraphQLObj } from 'graphql';
import Wallet from '../../models/Wallet';
import { MyContext } from '../types/MyContext';

export const createUser: GraphQLFieldConfig<unknown, MyContext, { [argName: string]: any }> = {
  type: UserType,
  args: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    try {
      console.log('xxxxxxxxxxxxxxxx');
      const existingUser = await User.findOne({ where: { email: args.email } });
      console.log('xxxxxxxxxxxxxxxx2');
      if (existingUser) {
        console.log('xxxxxxxxxxxxxxxx3');
        throw new Error('Email already in use');
      }
      console.log('xxxxxxxxxxxxxxxx4');
      const hashedPassword = await bcrypt.hash(args.password, 10);
      console.log('xxxxxxxxxxxxxxxx5');
      const user = await User.create({
        username: args.username,
        password: hashedPassword,
        email: args.email,
      });
      console.log('xxxxxxxxxxxxxxxx6');
      await Wallet.create({
        name: `Wallet 1`,
        balance: 0,
        userId: user.id,
      });

      return user;
    } catch (error) {
      console.log('error12312312', error);
      throw new Error(`Error registering user:  ${error.message}`);
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