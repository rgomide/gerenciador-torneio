const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Match extends Model {
    static associate(models) {
      Match.belongsTo(models.Tournament, {
        foreignKey: 'tournament_id',
        as: 'tournament'
      })
      Match.hasMany(models.MatchParticipant, {
        foreignKey: 'matchId',
        as: 'participants'
      })
      Match.hasMany(models.MatchScore, {
        foreignKey: 'matchId',
        as: 'scores'
      })
    }
  }

  Match.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      tournamentId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'tournament_id',
        references: {
          model: 'tournaments',
          key: 'id'
        }
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true
      },
      finished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      occurrences: {
        type: DataTypes.STRING,
        allowNull: true
      },
      roundNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'round_number'
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
      modelName: 'Match',
      tableName: 'matches',
      underscored: true
    }
  )

  return Match
}
