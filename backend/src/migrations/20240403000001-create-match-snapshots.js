'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('match_snapshots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      // Match information
      match_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      match_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      match_location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      match_round_number: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      match_occurrences: {
        type: Sequelize.STRING,
        allowNull: true
      },

      // Tournament information
      tournament_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      tournament_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tournament_start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      tournament_end_date: {
        type: Sequelize.DATE,
        allowNull: false
      },

      // Event information
      event_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      event_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      event_start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      event_end_date: {
        type: Sequelize.DATE,
        allowNull: false
      },

      // Unit information
      unit_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      unit_name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      // Institution information
      institution_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      institution_name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      // Sport information
      sport_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      sport_name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      // Match scores
      match_scores: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
        allowNull: false
      },

      match_participants: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
        allowNull: false
      },

      // Snapshot metadata
      snapshot_taken_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
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
    })

    // Add indexes for common query patterns
    await queryInterface.addIndex('match_snapshots', ['match_id'])
    await queryInterface.addIndex('match_snapshots', ['tournament_id'])
    await queryInterface.addIndex('match_snapshots', ['event_id'])
    await queryInterface.addIndex('match_snapshots', ['unit_id'])
    await queryInterface.addIndex('match_snapshots', ['institution_id'])
    await queryInterface.addIndex('match_snapshots', ['sport_id'])
    await queryInterface.addIndex('match_snapshots', ['snapshot_taken_at'])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('match_snapshots')
  }
}
