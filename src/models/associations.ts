import Category from './Category';
import User from './User';
import Wallet from './Wallet';

export const defineAssociations = () => {
  User.hasMany(Wallet, { foreignKey: 'userId' });
  Wallet.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(Category, { foreignKey: 'userId', as: 'categories' });
  Category.belongsTo(User, { foreignKey: 'userId', as: 'user' });
};
