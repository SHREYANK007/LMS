'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sessions', {
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
      tutor_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      event_id: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      meet_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: false
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

    await queryInterface.addIndex('sessions', ['tutor_id'], {
      name: 'sessions_tutor_id_idx'
    });

    await queryInterface.addIndex('sessions', ['start_time'], {
      name: 'sessions_start_time_idx'
    });

    await queryInterface.addIndex('sessions', ['event_id'], {
      unique: true,
      name: 'sessions_event_id_unique',
      where: {
        event_id: { [Sequelize.Op.ne]: null }
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sessions');
  }
};