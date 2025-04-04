const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {
    static associate(models) {
      this.belongsTo(models.Institution, {
        foreignKey: 'institutionId',
        as: 'institution'
      })
      this.hasMany(models.Event, {
        foreignKey: 'unitId',
        as: 'events'
      })
    }
  }

  Unit.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name',
        set(value) {
          this.setDataValue('name', value.trim())
        },
        validate: { notEmpty: true }
      },
      institutionId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'institution_id',
        references: {
          model: 'institutions',
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
      modelName: 'Unit',
      tableName: 'units'
    }
  )

  return Unit
}
