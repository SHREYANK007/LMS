'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new columns for Smart Quad sessions
    await queryInterface.addColumn('sessions', 'session_type', {
      type: Sequelize.ENUM('ONE_TO_ONE', 'SMART_QUAD', 'MASTERCLASS'),
      allowNull: false,
      defaultValue: 'ONE_TO_ONE'
    });

    await queryInterface.addColumn('sessions', 'course_type', {
      type: Sequelize.ENUM('PTE', 'IELTS', 'TOEFL', 'GENERAL_ENGLISH', 'BUSINESS_ENGLISH', 'ACADEMIC_WRITING'),
      allowNull: true
    });

    await queryInterface.addColumn('sessions', 'max_participants', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    });

    await queryInterface.addColumn('sessions', 'current_participants', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('sessions', 'calendar_event_url', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('sessions', 'status', {
      type: Sequelize.ENUM('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'SCHEDULED'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('sessions', 'session_type');
    await queryInterface.removeColumn('sessions', 'course_type');
    await queryInterface.removeColumn('sessions', 'max_participants');
    await queryInterface.removeColumn('sessions', 'current_participants');
    await queryInterface.removeColumn('sessions', 'calendar_event_url');
    await queryInterface.removeColumn('sessions', 'status');
  }
};