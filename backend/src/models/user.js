const { Model } = require('sequelize')
const {
  ROLES: { ADMIN, MANAGER }
} = require('@server/config/constants')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Role, {
        through: models.UserRole,
        foreignKey: 'user_id',
        otherKey: 'role_id',
        as: 'roles'
      })
    }
  }

  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name',
        set(value) {
          this.setDataValue('firstName', value.trim())
        },
        validate: { notEmpty: true }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'last_name',
        set(value) {
          this.setDataValue('lastName', value.trim())
        },
        validate: { notEmpty: true }
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'user_name',
        set(value) {
          this.setDataValue('userName', value.trim())
        },
        validate: { notEmpty: true }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'email',
        set(value) {
          this.setDataValue('email', value.trim())
        },
        validate: { notEmpty: true }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password'
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
      modelName: 'User',
      tableName: 'users',
      getterMethods: {
        isAdmin() {
          if (!this.roles || this.roles.length === 0) {
            return false
          }

          return this.roles.some((role) => role.name === ADMIN)
        },
        isManager() {
          if (!this.roles || this.roles.length === 0) {
            return false
          }

          return this.roles.some((role) => role.name === MANAGER)
        }
      }
    }
  )

  return User
}
