const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    static associate(models) {
      Team.belongsTo(models.Sport, {
        foreignKey: 'sportId',
        as: 'sport'
      })
      Team.belongsTo(models.Unit, {
        foreignKey: 'unitId',
        as: 'unit'
      })
    }
  }

  Team.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue('name', value.trim())
        },
        validate: { notEmpty: true }
      },
      sportId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'sport_id',
        references: {
          model: 'sports',
          key: 'id'
        }
      },
      unitId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'unit_id',
        references: {
          model: 'units',
          key: 'id'
        }
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
      modelName: 'Team',
      tableName: 'teams',
      underscored: true
    }
  )

  return Team
}
