const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class MatchParticipant extends Model {
    static associate(models) {
      MatchParticipant.belongsTo(models.Match, {
        foreignKey: 'matchId',
        as: 'match'
      })
      MatchParticipant.belongsTo(models.Team, {
        foreignKey: 'teamId',
        as: 'team'
      })
      MatchParticipant.belongsTo(models.Player, {
        foreignKey: 'playerId',
        as: 'player'
      })
    }
  }

  MatchParticipant.init(
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
        field: 'participant_type',
        validate: {
          isIn: [['team', 'player']]
        }
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
      modelName: 'MatchParticipant',
      tableName: 'match_participants',
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['match_id', 'team_id'],
          where: {
            team_id: {
              [sequelize.Sequelize.Op.ne]: null
            }
          }
        },
        {
          unique: true,
          fields: ['match_id', 'player_id'],
          where: {
            player_id: {
              [sequelize.Sequelize.Op.ne]: null
            }
          }
        }
      ],
      validate: {
        validateParticipantType() {
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

  return MatchParticipant
}
