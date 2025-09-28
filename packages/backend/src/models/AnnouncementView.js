const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const AnnouncementView = sequelize.define('AnnouncementView', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    announcementId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'announcement_id'
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id'
    },
    viewedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'viewed_at'
    },
    acknowledged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'announcement_views',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['announcement_id', 'user_id']
      }
    ]
  });

  AnnouncementView.associate = (models) => {
    AnnouncementView.belongsTo(models.Announcement, {
      foreignKey: 'announcement_id',
      as: 'announcement',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    AnnouncementView.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return AnnouncementView;
};