'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create features table
    await queryInterface.createTable('features', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create student_features table (many-to-many)
    await queryInterface.createTable('student_features', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      student_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      feature_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'features',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add index for faster queries
    await queryInterface.addIndex('student_features', ['student_id', 'feature_id'], {
      unique: true,
      name: 'student_features_unique_constraint'
    });

    // Insert default features
    const { v4: uuidv4 } = require('uuid');
    const now = new Date();
    const features = [
      {
        id: uuidv4(),
        key: 'one_to_one',
        label: 'One-to-One Sessions',
        description: 'Access to personal tutoring sessions',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        key: 'smart_quad',
        label: 'Smart Quad',
        description: 'Access to small group learning sessions',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        key: 'masterclass',
        label: 'Masterclass',
        description: 'Access to expert workshop sessions',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        key: 'materials',
        label: 'Study Materials',
        description: 'Access to study materials and resources',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        key: 'progress_tracking',
        label: 'Progress Tracking',
        description: 'Access to progress tracking and analytics',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        key: 'calendar',
        label: 'Calendar',
        description: 'Access to calendar and scheduling features',
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('features', features, {});

    // Enable all features for existing students by default
    const [students] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'STUDENT'"
    );

    const studentFeatures = [];
    for (const student of students) {
      for (const feature of features) {
        studentFeatures.push({
          id: uuidv4(),
          student_id: student.id,
          feature_id: feature.id,
          enabled: true,
          created_at: now,
          updated_at: now
        });
      }
    }

    if (studentFeatures.length > 0) {
      await queryInterface.bulkInsert('student_features', studentFeatures, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('student_features');
    await queryInterface.dropTable('features');
  }
};