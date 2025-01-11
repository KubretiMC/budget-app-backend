import { Dialect, Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT as Dialect,
    logging: true, // TODO: Remove in production
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected.');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
};

export default connectDB;
