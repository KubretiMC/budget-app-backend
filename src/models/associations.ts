import Category from './Category';
import Transaction from './Transaction';
import User from './User';
import Wallet from './Wallet';

export const defineAssociations = () => {
  User.hasMany(Wallet, { foreignKey: 'userId' });
  Wallet.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(Category, { foreignKey: 'userId', as: 'categories' });
  Category.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  Wallet.hasMany(Transaction, { foreignKey: 'walletId', as: 'transactions' });
  Transaction.belongsTo(Wallet, { foreignKey: 'walletId', as: 'wallet' });

  Category.hasMany(Transaction, { foreignKey: 'categoryId', as: 'transactions' });
  Transaction.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
};
