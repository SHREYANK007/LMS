const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Feature = sequelize.define('Feature', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'features',
    timestamps: true,
    underscored: true
  });

  Feature.associate = (models) => {
    Feature.belongsToMany(models.User, {
      through: models.StudentFeature,
      foreignKey: 'feature_id',
      otherKey: 'student_id',
      as: 'students'
    });
  };

  return Feature;
};