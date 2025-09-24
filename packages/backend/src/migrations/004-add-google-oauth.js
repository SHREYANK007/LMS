'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add Google OAuth columns to users table
    await queryInterface.addColumn('users', 'google_access_token', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'google_refresh_token', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'google_token_expiry', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'google_calendar_connected', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    await queryInterface.addColumn('users', 'google_email', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'google_access_token');
    await queryInterface.removeColumn('users', 'google_refresh_token');
    await queryInterface.removeColumn('users', 'google_token_expiry');
    await queryInterface.removeColumn('users', 'google_calendar_connected');
    await queryInterface.removeColumn('users', 'google_email');
  }
};