const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class UserEvent extends Model {
    static associate(models) {
      UserEvent.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      })
      UserEvent.belongsTo(models.Event, {
        foreignKey: 'event_id',
        as: 'event'
      })
    }
  }

  UserEvent.init(
    {
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      eventId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        field: 'event_id',
        references: {
          model: 'events',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'UserEvent',
      tableName: 'users_events',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'event_id']
        }
      ]
    }
  )

  return UserEvent
}
