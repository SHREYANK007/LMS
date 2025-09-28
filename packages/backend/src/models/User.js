const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'TUTOR', 'STUDENT'),
      allowNull: false
    },
    courseType: {
      type: DataTypes.ENUM('PTE', 'NAATI'),
      allowNull: true,
      field: 'course_type'
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'date_of_birth'
    },
    emergencyContact: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'emergency_contact'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login'
    },
    googleAccessToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'google_access_token'
    },
    googleRefreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'google_refresh_token'
    },
    googleTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'google_token_expiry'
    },
    googleCalendarConnected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      field: 'google_calendar_connected'
    },
    googleEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'google_email'
    },
    averageRating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null,
      field: 'average_rating'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['email']
      }
    ]
  });

  User.associate = (models) => {
    User.hasMany(models.Session, {
      foreignKey: 'tutorId',
      as: 'tutorSessions'
    });

    // Student features association
    User.belongsToMany(models.Feature, {
      through: models.StudentFeature,
      foreignKey: 'student_id',
      otherKey: 'feature_id',
      as: 'features'
    });

    User.hasMany(models.StudentFeature, {
      foreignKey: 'student_id',
      as: 'studentFeatures'
    });

    // Tutor-Student associations
    User.belongsToMany(models.User, {
      through: models.TutorStudent,
      as: 'students',
      foreignKey: 'tutor_id',
      otherKey: 'student_id'
    });

    User.belongsToMany(models.User, {
      through: models.TutorStudent,
      as: 'tutors',
      foreignKey: 'student_id',
      otherKey: 'tutor_id'
    });
  };

  return User;
};