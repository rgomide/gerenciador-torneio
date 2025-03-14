const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    static associate(models) {
      // associations can be defined here if needed
    }
  }

  UserRole.init(
    {
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id'
        }
      },
      roleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'role_id',
        references: {
          model: 'roles',
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
      modelName: 'UserRole',
      tableName: 'users_roles',
      underscored: false,
      timestamps: true
    }
  )

  return UserRole
}
