module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    tutor_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'reviews',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['student_id', 'tutor_id']
      },
      {
        fields: ['tutor_id', 'is_active']
      }
    ]
  });

  Review.associate = (models) => {
    Review.belongsTo(models.User, {
      foreignKey: 'student_id',
      as: 'student'
    });
    Review.belongsTo(models.User, {
      foreignKey: 'tutor_id',
      as: 'tutor'
    });
  };

  return Review;
};