import { GraphQLNonNull, GraphQLString, GraphQLFieldConfig } from 'graphql';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserType from '../types/UserType';
import User from '../../models/User';
import { GraphQLObjectType as GraphQLObj } from 'graphql';

export const createUser: GraphQLFieldConfig<any, any, { [argName: string]: any }> = {
  type: UserType,
  args: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    try {
      const existingUser = await User.findOne({ where: { email: args.email } });
      if (existingUser) {
        throw new Error('Email already in use');
      }
      
      const hashedPassword = await bcrypt.hash(args.password, 10);
      const user = await User.create({
        username: args.username,
        password: hashedPassword,
        email: args.email,
      });
      return user;
    } catch (error) {
      throw new Error('Error registering user');
    }
  },
};

export const loginUser: GraphQLFieldConfig<any, any, { [argName: string]: any }> = {
  type: new GraphQLObj({
    name: 'AuthPayload',
    fields: () => ({
      token: { type: GraphQLString },
      user: { type: UserType },
    }),
  }),
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    try {
      if (!process.env.SECRET_KEY) {
        throw new Error('Missing SECRET_KEY in environment variables');
      }

      const user = await User.findOne({ where: { email: args.email } });
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      const isValidPassword = await bcrypt.compare(args.password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '7d' });
      return { token, user };
    } catch (error) {
      throw new Error('Error logging in');
    }
  },
};

interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string };
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    if (!process.env.SECRET_KEY) {
      throw new Error('Missing SECRET_KEY in environment variables');
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY) as jwt.JwtPayload;
    if (!decoded || typeof decoded !== 'object' || !decoded.id || !decoded.email) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    (req as AuthenticatedRequest).user = { id: decoded.id as number, email: decoded.email as string };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const protectedQuery: GraphQLFieldConfig<any, any, any> = {
  type: GraphQLString,
  resolve: async (parent, args, context) => {
    if (!context.user) {
      throw new Error('Unauthorized');
    }
    return 'This is a protected query';
  },
};
