const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Institution extends Model {
    static associate(models) {
      // Add associations here if needed
    }
  }

  Institution.init(
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
      modelName: 'Institution',
      tableName: 'institutions'
    }
  )

  return Institution
}
