'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('clients', [
      {
        name: 'Carlos Silva',
        email: 'carlos@example.com',
        phone: '999999999',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Maria Oliveira',
        email: 'maria@example.com',
        phone: '988888888',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('clients', null, {});
  }
};
