'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('session_requests', 'calendar_event_id', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Google Calendar event ID'
    });

    await queryInterface.addColumn('session_requests', 'meet_link', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Google Meet link for the session'
    });

    await queryInterface.addColumn('session_requests', 'calendar_event_link', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Link to the Google Calendar event'
    });

    await queryInterface.addColumn('session_requests', 'scheduled_date_time', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Actual scheduled date and time for the session'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('session_requests', 'calendar_event_id');
    await queryInterface.removeColumn('session_requests', 'meet_link');
    await queryInterface.removeColumn('session_requests', 'calendar_event_link');
    await queryInterface.removeColumn('session_requests', 'scheduled_date_time');
  }
};