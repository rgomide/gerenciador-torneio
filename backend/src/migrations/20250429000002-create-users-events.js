'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users_events', {
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      eventId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        field: 'event_id',
        references: {
          model: 'events',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at'
      }
    })

    await queryInterface.addConstraint('users_events', {
      fields: ['user_id', 'event_id'],
      type: 'unique',
      name: 'users_events_user_id_event_id_unique'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users_events')
  }
}
