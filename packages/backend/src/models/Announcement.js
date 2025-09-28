const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Announcement = sequelize.define('Announcement', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.ENUM('info', 'urgent', 'offer', 'event', 'materials', 'schedule', 'results', 'success'),
      defaultValue: 'info'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium'
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft'
    },
    targetAudience: {
      type: DataTypes.ENUM('all', 'pte', 'naati', 'specific'),
      defaultValue: 'all',
      field: 'target_audience'
    },
    courseType: {
      type: DataTypes.ENUM('PTE', 'NAATI', 'ALL'),
      allowNull: true,
      field: 'course_type'
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'author_id'
    },
    publishDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'publish_date'
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expiry_date'
    },
    isGlobal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_global'
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'view_count'
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
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
    tableName: 'announcements',
    timestamps: true,
    underscored: true
  });

  Announcement.associate = (models) => {
    Announcement.belongsTo(models.User, {
      foreignKey: 'author_id',
      as: 'author',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    Announcement.hasMany(models.AnnouncementView, {
      foreignKey: 'announcement_id',
      as: 'views',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Announcement;
};