const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    static associate(models) {
      Player.belongsTo(models.Unit, {
        foreignKey: 'unit_id',
        as: 'unit'
      })
    }
  }

  Player.init(
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
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
      modelName: 'Player',
      tableName: 'players',
      underscored: true
    }
  )

  return Player
}
