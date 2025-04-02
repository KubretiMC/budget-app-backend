import { Dialect, Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.MYSQL_ADDON_DB as string,
  process.env.MYSQL_ADDON_USER as string,
  process.env.MYSQL_ADDON_PASSWORD as string,
  {
    host: process.env.MYSQL_ADDON_HOST,
    port: Number(process.env.MYSQL_ADDON_PORT),
    dialect: process.env.DB_DIALECT as Dialect,
    logging: false,
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
