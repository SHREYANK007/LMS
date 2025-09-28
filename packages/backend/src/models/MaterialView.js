const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const MaterialView = sequelize.define('MaterialView', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    materialId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'material_id'
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
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'View duration in seconds'
    }
  }, {
    tableName: 'material_views',
    timestamps: false,
    underscored: true
  });

  MaterialView.associate = (models) => {
    MaterialView.belongsTo(models.Material, {
      foreignKey: 'material_id',
      as: 'material'
    });

    MaterialView.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'viewer'
    });
  };

  return MaterialView;
};