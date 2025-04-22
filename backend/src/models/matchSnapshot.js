const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class MatchSnapshot extends Model {}

  MatchSnapshot.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      // Match information
      matchId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'match_id'
      },
      matchDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'match_date'
      },
      matchLocation: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'match_location'
      },
      matchRoundNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'match_round_number'
      },
      matchOccurrences: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'match_occurrences'
      },

      // Tournament information
      tournamentId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'tournament_id'
      },
      tournamentName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'tournament_name'
      },
      tournamentStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'tournament_start_date'
      },
      tournamentEndDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'tournament_end_date'
      },

      // Event information
      eventId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'event_id'
      },
      eventName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'event_name'
      },
      eventStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'event_start_date'
      },
      eventEndDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'event_end_date'
      },

      // Unit information
      unitId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'unit_id'
      },
      unitName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'unit_name'
      },

      // Institution information
      institutionId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'institution_id'
      },
      institutionName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'institution_name'
      },

      // Sport information
      sportId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'sport_id'
      },
      sportName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'sport_name'
      },

      // Match scores and participants as JSONB arrays
      matchScores: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: false,
        field: 'match_scores'
      },
      matchParticipants: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: false,
        field: 'match_participants'
      },

      // Snapshot metadata
      snapshotTakenAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'snapshot_taken_at',
        defaultValue: DataTypes.NOW
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'MatchSnapshot',
      tableName: 'match_snapshots',
      underscored: true,
      validate: {
        validateMatchParticipants() {
          if (!Array.isArray(this.matchParticipants)) {
            throw new Error('matchParticipants must be an array')
          }

          this.matchParticipants.forEach((participant) => {
            if (typeof participant !== 'object' || participant === null) {
              throw new Error('matchParticipants must be an array of objects')
            }

            const { id, name, participantType } = participant

            if (
              typeof id !== 'string' ||
              typeof name !== 'string' ||
              typeof participantType !== 'string'
            ) {
              throw new Error(
                'matchParticipants must be an array of objects with id, name, and participantType properties'
              )
            }
          })
        },
        validateMatchScores() {
          if (!Array.isArray(this.matchScores)) {
            throw new Error('matchScores must be an array')
          }

          this.matchScores.forEach((score) => {
            if (typeof score !== 'object' || score === null) {
              throw new Error('matchScores must be an array of objects')
            }

            const { id, name, participantType, score: scoreValue, details = '' } = score

            if (
              typeof id !== 'string' ||
              typeof name !== 'string' ||
              typeof participantType !== 'string' ||
              typeof scoreValue !== 'number' ||
              (details && typeof details !== 'string')
            ) {
              throw new Error(
                'matchScores must be an array of objects with id, name, participantType, score, and details properties'
              )
            }

            if (participantType !== 'team' && participantType !== 'player') {
              throw new Error('participantType must be either "team" or "player"')
            }
          })
        }
      }
    }
  )

  return MatchSnapshot
}
