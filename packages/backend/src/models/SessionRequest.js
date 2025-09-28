const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const SessionRequest = sequelize.define('SessionRequest', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'student_id'
    },
    tutorId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'tutor_id'
    },
    preferredDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'preferred_date'
    },
    preferredTime: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'preferred_time'
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 60,
      comment: 'Duration in minutes'
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'ASSIGNED', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'admin_notes'
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'rejection_reason'
    },
    calendarEventId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'calendar_event_id',
      comment: 'Google Calendar event ID'
    },
    meetLink: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'meet_link',
      comment: 'Google Meet link for the session'
    },
    calendarEventLink: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'calendar_event_link',
      comment: 'Link to the Google Calendar event'
    },
    scheduledDateTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'scheduled_date_time',
      comment: 'Actual scheduled date and time for the session'
    },
    tutorCalendarEventId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'tutor_calendar_event_id',
      comment: 'Google Calendar event ID for tutor'
    },
    studentCalendarEventId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'student_calendar_event_id',
      comment: 'Google Calendar event ID for student'
    }
  }, {
    tableName: 'session_requests',
    timestamps: true,
    underscored: true
  });

  SessionRequest.associate = (models) => {
    SessionRequest.belongsTo(models.User, {
      foreignKey: 'student_id',
      as: 'student'
    });

    SessionRequest.belongsTo(models.User, {
      foreignKey: 'tutor_id',
      as: 'tutor'
    });
  };

  return SessionRequest;
};