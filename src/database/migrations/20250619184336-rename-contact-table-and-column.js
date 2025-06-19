'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable('contact', 'contacts');
    await queryInterface.renameColumn('contacts', 'customers_id', 'customer_id');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('contacts', 'customer_id', 'customers_id');
    await queryInterface.renameTable('contacts', 'contact');
  }
};
