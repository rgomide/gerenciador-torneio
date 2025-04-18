'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('match_participants', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      matchId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        field: 'match_id',
        references: {
          model: 'matches',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      participantType: {
        type: Sequelize.ENUM('team', 'player'),
        allowNull: false,
        field: 'participant_type'
      },
      teamId: {
        type: Sequelize.BIGINT,
        allowNull: true,
        field: 'team_id',
        references: {
          model: 'teams',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      playerId: {
        type: Sequelize.BIGINT,
        allowNull: true,
        field: 'player_id',
        references: {
          model: 'players',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    // Add unique constraint to ensure a team/player can only participate once in a match
    await queryInterface.addConstraint('match_participants', {
      fields: ['match_id', 'team_id'],
      type: 'unique',
      name: 'unique_team_participation'
    })

    await queryInterface.addConstraint('match_participants', {
      fields: ['match_id', 'player_id'],
      type: 'unique',
      name: 'unique_player_participation'
    })

    // Add check constraint to ensure either team_id or player_id is set based on participant_type
    await queryInterface.addConstraint('match_participants', {
      fields: ['participant_type', 'team_id', 'player_id'],
      type: 'check',
      name: 'participant_type_check',
      where: {
        [Sequelize.Op.or]: [
          {
            participant_type: 'team',
            team_id: { [Sequelize.Op.ne]: null },
            player_id: null
          },
          {
            participant_type: 'player',
            player_id: { [Sequelize.Op.ne]: null },
            team_id: null
          }
        ]
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('match_participants')
  }
}
