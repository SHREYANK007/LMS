'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'name', {
      type: Sequelize.STRING,
      allowNull: true // Allow null initially for existing users
    });

    await queryInterface.addColumn('users', 'course_type', {
      type: Sequelize.ENUM('PTE', 'IELTS', 'TOEFL', 'GENERAL_ENGLISH', 'BUSINESS_ENGLISH', 'ACADEMIC_WRITING'),
      allowNull: true // Allow null for admin users who don't need course types
    });

    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'date_of_birth', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'emergency_contact', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'is_active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });

    await queryInterface.addColumn('users', 'last_login', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'name');
    await queryInterface.removeColumn('users', 'course_type');
    await queryInterface.removeColumn('users', 'phone');
    await queryInterface.removeColumn('users', 'date_of_birth');
    await queryInterface.removeColumn('users', 'emergency_contact');
    await queryInterface.removeColumn('users', 'is_active');
    await queryInterface.removeColumn('users', 'last_login');
  }
};