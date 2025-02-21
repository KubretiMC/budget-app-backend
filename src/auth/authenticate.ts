import jwt from 'jsonwebtoken';
import User from '../models/User';

export const authenticateUser = async (authHeader: string) => {
  if (!authHeader) {
    throw new Error('No token provided');
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Error('Invalid token format');
  }
  if (!process.env.SECRET_KEY) {
    throw new Error('Missing secret key');
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
      throw new Error('Invalid token');
    }
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      throw new Error('User does not exist');
    }
    return decoded;
  } catch (error) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
};
