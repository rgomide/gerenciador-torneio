'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class RequestLog extends Model {
    static associate(models) {
      // Define associations here if needed
      // For example, if you want to associate with User model:
      // RequestLog.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
    }
  }

  RequestLog.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'user_id'
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'user_name'
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'ip'
      },
      method: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'method'
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'url'
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'status'
      },
      responseTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'response_time'
      },
      payload: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'payload'
      },
      response: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'response'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'RequestLog',
      tableName: 'request_logs',
      timestamps: false,
      underscored: true
    }
  )

  return RequestLog
}
