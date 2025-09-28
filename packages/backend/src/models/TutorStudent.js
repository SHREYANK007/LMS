module.exports = (sequelize, DataTypes) => {
  const TutorStudent = sequelize.define('TutorStudent', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tutor_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    assignedAt: {
      type: DataTypes.DATE,
      field: 'assigned_at',
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'tutor_students',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['tutor_id', 'student_id']
      }
    ]
  });

  TutorStudent.associate = (models) => {
    TutorStudent.belongsTo(models.User, {
      foreignKey: 'tutor_id',
      as: 'tutor'
    });
    TutorStudent.belongsTo(models.User, {
      foreignKey: 'student_id',
      as: 'student'
    });
  };

  return TutorStudent;
};