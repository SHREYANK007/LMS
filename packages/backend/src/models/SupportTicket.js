const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const SupportTicket = sequelize.define('SupportTicket', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    ticketNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      field: 'ticket_number'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('technical', 'academic', 'billing', 'general', 'feedback'),
      allowNull: false,
      defaultValue: 'general'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium'
    },
    status: {
      type: DataTypes.ENUM('open', 'in_progress', 'waiting_for_response', 'resolved', 'closed'),
      allowNull: false,
      defaultValue: 'open'
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'student_id'
    },
    assignedTutorId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'assigned_tutor_id'
    },
    assignedAdminId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'assigned_admin_id'
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'resolved_at'
    },
    closedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'closed_at'
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    tableName: 'support_tickets',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['ticket_number']
      },
      {
        fields: ['student_id']
      },
      {
        fields: ['assigned_tutor_id']
      },
      {
        fields: ['assigned_admin_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['category']
      },
      {
        fields: ['priority']
      },
      {
        fields: ['created_at']
      }
    ],
    hooks: {
      beforeCreate: async (ticket) => {
        if (!ticket.ticketNumber) {
          // Generate ticket number: TK-YYYY-NNNNNN
          const year = new Date().getFullYear();
          const randomNum = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
          ticket.ticketNumber = `TK-${year}-${randomNum}`;
        }
      }
    }
  });

  SupportTicket.associate = (models) => {
    // Belongs to student
    SupportTicket.belongsTo(models.User, {
      foreignKey: 'studentId',
      as: 'student'
    });

    // Belongs to assigned tutor
    SupportTicket.belongsTo(models.User, {
      foreignKey: 'assignedTutorId',
      as: 'assignedTutor'
    });

    // Belongs to assigned admin
    SupportTicket.belongsTo(models.User, {
      foreignKey: 'assignedAdminId',
      as: 'assignedAdmin'
    });

    // Has many replies
    if (models.SupportTicketReply && models.SupportTicketReply.name) {
      SupportTicket.hasMany(models.SupportTicketReply, {
        foreignKey: 'ticketId',
        as: 'replies'
      });
    }
  };

  return SupportTicket;
};