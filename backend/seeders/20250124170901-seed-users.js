'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('da_users', [
      {
        name: 'Employer One',
        email: 'employer1@example.com',
        password_hash: 'hashed_password_1', // Substitua por um hash real
        phone_number: '1234567890',
        user_type: 'employer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Worker One',
        email: 'worker1@example.com',
        password_hash: 'hashed_password_2', // Substitua por um hash real
        phone_number: '0987654321',
        user_type: 'worker',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('da_users', null, {});
  },
};
