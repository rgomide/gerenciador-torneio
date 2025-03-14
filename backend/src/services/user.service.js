const { User, Role } = require('@server/models')
const AppError = require('@server/utils/AppError')

const findAll = async () => {
  const users = await User.findAll({
    include: [
      {
        model: Role,
        as: 'roles'
      }
    ],
    order: [['id', 'ASC']]
  })

  return users
}

const findById = async (id) => {
  const user = await User.findByPk(id, {
    include: [
      {
        model: Role,
        as: 'roles'
      }
    ]
  })

  if (!user) {
    throw new AppError('User not found', 404)
  }

  return user
}

module.exports = { findAll, findById }
