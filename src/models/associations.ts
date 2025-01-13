import User from './User';
import Wallet from './Wallet';

export const defineAssociations = () => {
  User.hasMany(Wallet, { foreignKey: 'userId' });
  Wallet.belongsTo(User, { foreignKey: 'userId' });
};
