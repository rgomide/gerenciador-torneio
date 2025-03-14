const jwt = require('jsonwebtoken')
const { findById } = require('@server/services/user.service')
const { JWT } = require('@server/config/constants')

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization']

  if (!authHeader) {
    return next()
  }

  const token = authHeader.split(' ')[1]

  try {
    const { id } = jwt.verify(token, JWT.SECRET)
    const user = await findById(id)

    req.user = user

    next()
  } catch (error) {
    next()
  }
}

module.exports = authMiddleware
