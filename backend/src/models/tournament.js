const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Tournament extends Model {
    static associate(models) {
      Tournament.belongsTo(models.Event, {
        foreignKey: 'event_id',
        as: 'event'
      })

      Tournament.hasMany(models.Match, {
        foreignKey: 'tournament_id',
        as: 'matches'
      })
    }
  }

  Tournament.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      eventId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'event_id',
        references: {
          model: 'events',
          key: 'id'
        }
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_date'
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'end_date'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at'
      }
    },
    {
      sequelize,
      modelName: 'Tournament',
      tableName: 'tournaments',
      underscored: true
    }
  )

  return Tournament
}
