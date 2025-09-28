const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tutorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    eventId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    meetLink: {
      type: DataTypes.STRING,
      allowNull: true
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    sessionType: {
      type: DataTypes.ENUM('ONE_TO_ONE', 'SMART_QUAD', 'MASTERCLASS'),
      allowNull: false,
      defaultValue: 'ONE_TO_ONE'
    },
    courseType: {
      type: DataTypes.ENUM('PTE', 'IELTS'),
      allowNull: true
    },
    maxParticipants: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    currentParticipants: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    calendarEventUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'SCHEDULED'
    }
  }, {
    tableName: 'sessions',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['tutor_id']
      },
      {
        fields: ['start_time']
      },
      {
        unique: true,
        fields: ['event_id'],
        where: {
          event_id: { [sequelize.Sequelize.Op.ne]: null }
        }
      }
    ]
  });

  Session.associate = (models) => {
    Session.belongsTo(models.User, {
      foreignKey: 'tutorId',
      as: 'tutor'
    });
  };

  return Session;
};