'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('teams_players', {
      playerId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        field: 'player_id',
        primaryKey: true,
        references: {
          model: 'players',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      teamId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        field: 'team_id',
        primaryKey: true,
        references: {
          model: 'teams',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      details: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'created_at',
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'updated_at',
        defaultValue: Sequelize.NOW
      }
    })

    // No need for separate indexes since they're part of the primary key
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('teams_players')
  }
} 