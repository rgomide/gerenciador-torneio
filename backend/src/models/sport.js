const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Sport extends Model {
    static associate(models) {
      // Add associations here if needed in the future
    }
  }

  Sport.init(
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
      modelName: 'Sport',
      tableName: 'sports',
      underscored: true
    }
  )

  return Sport
}
