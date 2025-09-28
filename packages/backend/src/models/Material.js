const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Material = sequelize.define('Material', {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'file_name'
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'file_path'
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'file_size',
      comment: 'File size in bytes'
    },
    courseCategory: {
      type: DataTypes.ENUM('PTE', 'NAATI', 'ALL'),
      allowNull: false,
      field: 'course_category',
      defaultValue: 'ALL'
    },
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'uploaded_by'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'view_count'
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: 'Array of tags for categorization'
    }
  }, {
    tableName: 'materials',
    timestamps: true,
    underscored: true
  });

  Material.associate = (models) => {
    Material.belongsTo(models.User, {
      foreignKey: 'uploaded_by',
      as: 'uploader'
    });

    Material.hasMany(models.MaterialView, {
      foreignKey: 'material_id',
      as: 'views'
    });
  };

  return Material;
};