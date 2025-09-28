'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create materials table
    await queryInterface.createTable('materials', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      file_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      file_path: {
        type: Sequelize.STRING,
        allowNull: false
      },
      file_size: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'File size in bytes'
      },
      course_category: {
        type: Sequelize.ENUM('PTE', 'NAATI', 'ALL'),
        allowNull: false,
        defaultValue: 'ALL'
      },
      uploaded_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      view_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      tags: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create material_views table
    await queryInterface.createTable('material_views', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      material_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'materials',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      viewed_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'View duration in seconds'
      }
    });

    // Add indexes
    await queryInterface.addIndex('materials', ['course_category']);
    await queryInterface.addIndex('materials', ['uploaded_by']);
    await queryInterface.addIndex('materials', ['is_active']);
    await queryInterface.addIndex('material_views', ['material_id']);
    await queryInterface.addIndex('material_views', ['user_id']);
    await queryInterface.addIndex('material_views', ['viewed_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('material_views');
    await queryInterface.dropTable('materials');
  }
};