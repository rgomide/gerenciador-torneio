const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class TeamPlayer extends Model {
    static associate(models) {
      TeamPlayer.belongsTo(models.Player, {
        foreignKey: 'playerId',
        as: 'player'
      })
      TeamPlayer.belongsTo(models.Team, {
        foreignKey: 'teamId',
        as: 'team'
      })
    }
  }

  TeamPlayer.init(
    {
      playerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'player_id',
        primaryKey: true,
        references: {
          model: 'players',
          key: 'id'
        }
      },
      teamId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'team_id',
        primaryKey: true,
        references: {
          model: 'teams',
          key: 'id'
        }
      },
      details: {
        type: DataTypes.STRING,
        allowNull: true
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
      modelName: 'TeamPlayer',
      tableName: 'teams_players',
      underscored: true
    }
  )

  return TeamPlayer
}
