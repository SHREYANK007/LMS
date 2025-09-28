const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const SupportTicketReply = sequelize.define('SupportTicketReply', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    ticketId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'ticket_id'
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isInternal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_internal'
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    }
  }, {
    tableName: 'support_ticket_replies',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['ticket_id']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['created_at']
      }
    ]
  });

  SupportTicketReply.associate = (models) => {
    // Belongs to ticket
    if (models.SupportTicket) {
      SupportTicketReply.belongsTo(models.SupportTicket, {
        foreignKey: 'ticketId',
        as: 'ticket'
      });
    }

    // Belongs to user (who wrote the reply)
    if (models.User) {
      SupportTicketReply.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  };

  return SupportTicketReply;
};