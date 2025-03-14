const jwt = require('jsonwebtoken')
const { JWT } = require('@server/config/constants')
const { User, Role } = require('@server/models')
const AppError = require('@server/utils/AppError')

const login = async (userName, password) => {
  if (!userName || !password) {
    throw new AppError('User name and password are required', 400)
  }

  const user = await User.findOne({ where: { userName }, include: [{ model: Role, as: 'roles' }] })

  if (!user) {
    throw new AppError('User not found', 404)
  }

  if (user.password !== password) {
    throw new AppError('Invalid password', 401)
  }

  const token = jwt.sign({ id: user.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

  return { user, token }
}

module.exports = { login }
