'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Service, { foreignKey: 'employer_id' });
      this.hasMany(models.Feedback, { foreignKey: 'reviewer_id' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    user_type: DataTypes.ENUM('employer', 'worker'),
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
