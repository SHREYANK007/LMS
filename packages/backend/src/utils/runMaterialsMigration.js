const { sequelize } = require('../models');

async function runMaterialsMigration() {
  try {
    // Create materials table
    await sequelize.getQueryInterface().createTable('materials', {
      id: {
        type: sequelize.Sequelize.UUID,
        defaultValue: sequelize.Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: sequelize.Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: sequelize.Sequelize.TEXT,
        allowNull: true
      },
      file_name: {
        type: sequelize.Sequelize.STRING,
        allowNull: false
      },
      file_path: {
        type: sequelize.Sequelize.STRING,
        allowNull: false
      },
      file_size: {
        type: sequelize.Sequelize.INTEGER,
        allowNull: false,
        comment: 'File size in bytes'
      },
      course_category: {
        type: sequelize.Sequelize.ENUM('PTE', 'NAATI', 'ALL'),
        allowNull: false,
        defaultValue: 'ALL'
      },
      uploaded_by: {
        type: sequelize.Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      is_active: {
        type: sequelize.Sequelize.BOOLEAN,
        defaultValue: true
      },
      view_count: {
        type: sequelize.Sequelize.INTEGER,
        defaultValue: 0
      },
      tags: {
        type: sequelize.Sequelize.JSON,
        defaultValue: []
      },
      created_at: {
        type: sequelize.Sequelize.DATE,
        allowNull: false,
        defaultValue: sequelize.Sequelize.NOW
      },
      updated_at: {
        type: sequelize.Sequelize.DATE,
        allowNull: false,
        defaultValue: sequelize.Sequelize.NOW
      }
    });

    // Create material_views table
    await sequelize.getQueryInterface().createTable('material_views', {
      id: {
        type: sequelize.Sequelize.UUID,
        defaultValue: sequelize.Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      material_id: {
        type: sequelize.Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'materials',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: sequelize.Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      viewed_at: {
        type: sequelize.Sequelize.DATE,
        defaultValue: sequelize.Sequelize.NOW
      },
      duration: {
        type: sequelize.Sequelize.INTEGER,
        allowNull: true,
        comment: 'View duration in seconds'
      }
    });

    // Add indexes
    await sequelize.getQueryInterface().addIndex('materials', ['course_category']);
    await sequelize.getQueryInterface().addIndex('materials', ['uploaded_by']);
    await sequelize.getQueryInterface().addIndex('materials', ['is_active']);
    await sequelize.getQueryInterface().addIndex('material_views', ['material_id']);
    await sequelize.getQueryInterface().addIndex('material_views', ['user_id']);
    await sequelize.getQueryInterface().addIndex('material_views', ['viewed_at']);

    console.log('✓ Materials tables created successfully');
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✓ Materials tables already exist');
    } else {
      console.error('Error creating materials tables:', error);
      throw error;
    }
  } finally {
    await sequelize.close();
  }
}

runMaterialsMigration();