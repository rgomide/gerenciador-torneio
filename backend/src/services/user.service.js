const { Op } = require('sequelize')
const { User, Role, Event } = require('@server/models')
const AppError = require('@server/utils/AppError')

const validateFields = (user) => {
  const { userName, firstName, email, password } = user

  if (!userName) {
    throw new AppError('Nome de usuário é obrigatório', 400)
  }

  if (!firstName) {
    throw new AppError('Nome é obrigatório', 400)
  }

  if (!email) {
    throw new AppError('Email é obrigatório', 400)
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new AppError('Formato de email inválido', 400)
  }

  if (!password) {
    throw new AppError('Senha é obrigatória', 400)
  }
}

const validateUpdatePermission = (authUser, updatedUser) => {
  if (!authUser) {
    return
  }

  if (authUser.isAdmin) {
    return
  }

  if (authUser.isManager && updatedUser.id !== authUser.id) {
    throw new AppError('Usuário não tem permissão para atualizar este usuário', 403)
  }

  if (authUser.isManager) {
    return
  }

  throw new AppError('Usuário não tem permissão para atualizar usuários', 403)
}

const remove = async (id, authUser) => {
  const user = await User.findByPk(id)

  if (!user) {
    throw new AppError('Usuário não encontrado', 404)
  }

  if (authUser && !authUser.isAdmin) {
    throw new AppError('Usuário não tem permissão para deletar usuários', 403)
  }

  if (authUser?.id === id) {
    throw new AppError('Usuário não pode se deletar', 403)
  }

  await user.destroy()
}

const update = async (id, user, authUser) => {
  const where = []

  if (user.userName) {
    where.push({ userName: user.userName })
  }

  if (user.email) {
    where.push({ email: user.email })
  }

  if (where.length > 0) {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: where
      }
    })

    if (existingUser && existingUser.id !== id) {
      throw new AppError('Usuário já existe', 400)
    }
  }

  const updatedUser = await User.findByPk(id)

  if (!updatedUser) {
    throw new AppError('Usuário não encontrado', 404)
  }

  validateUpdatePermission(authUser, updatedUser)

  await updatedUser.update(user)

  return updatedUser
}

const create = async (user, authUser) => {
  validateFields(user)

  if (authUser && !authUser.isAdmin) {
    throw new AppError('Usuário não tem permissão para criar usuário', 403)
  }

  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ userName: user.userName }, { email: user.email }]
    }
  })

  if (existingUser) {
    throw new AppError('Usuário já existe', 400)
  }

  const newUser = await User.create(user)

  return newUser
}

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
      },
      {
        model: Event,
        as: 'events'
      }
    ]
  })

  if (!user) {
    throw new AppError('User not found', 404)
  }

  return user
}

module.exports = { findAll, findById, create, update, remove }
