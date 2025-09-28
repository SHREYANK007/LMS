'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add separate event IDs for tutor and student
    await queryInterface.addColumn('session_requests', 'tutor_calendar_event_id', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Google Calendar event ID for tutor'
    });

    await queryInterface.addColumn('session_requests', 'student_calendar_event_id', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Google Calendar event ID for student'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('session_requests', 'tutor_calendar_event_id');
    await queryInterface.removeColumn('session_requests', 'student_calendar_event_id');
  }
};