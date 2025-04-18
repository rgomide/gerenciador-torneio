const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class MatchScore extends Model {
    static associate(models) {
      MatchScore.belongsTo(models.Match, {
        foreignKey: 'matchId',
        as: 'match'
      })
      MatchScore.belongsTo(models.Team, {
        foreignKey: 'teamId',
        as: 'team'
      })
      MatchScore.belongsTo(models.Player, {
        foreignKey: 'playerId',
        as: 'player'
      })
    }
  }

  MatchScore.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      matchId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'match_id',
        references: {
          model: 'matches',
          key: 'id'
        }
      },
      participantType: {
        type: DataTypes.ENUM('team', 'player'),
        allowNull: false,
        field: 'participant_type'
      },
      teamId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'team_id',
        references: {
          model: 'teams',
          key: 'id'
        }
      },
      playerId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'player_id',
        references: {
          model: 'players',
          key: 'id'
        }
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'score'
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'details'
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
      tableName: 'match_scores',
      timestamps: true,
      underscored: true,
      validate: {
        validateParticipantType() {
          if (!['team', 'player'].includes(this.participantType)) {
            throw new Error('Invalid participant type')
          }

          if (this.participantType === 'team') {
            if (!this.teamId) {
              throw new Error('teamId is required when participantType is team')
            }
            if (this.playerId) {
              throw new Error('playerId must be null when participantType is team')
            }
          } else if (this.participantType === 'player') {
            if (!this.playerId) {
              throw new Error('playerId is required when participantType is player')
            }
            if (this.teamId) {
              throw new Error('teamId must be null when participantType is player')
            }
          }
        }
      }
    }
  )

  return MatchScore
}
