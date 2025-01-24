'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'employer_id' });
      this.hasMany(models.Feedback, { foreignKey: 'service_id' });
    }
  }
  Service.init({
    employer_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    location: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    pay: DataTypes.DECIMAL(10, 2),
    status: DataTypes.ENUM('open', 'in_progress', 'completed'),
  }, {
    sequelize,
    modelName: 'Service',
  });
  return Service;
};
