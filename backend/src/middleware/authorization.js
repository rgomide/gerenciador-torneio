const authorizationMiddleware = (requiredRoles = []) => {
  return (req, res, next) => {
    if (requiredRoles.length === 0) {
      return next()
    }

    const { roles = [] } = req.user || {}

    const hasPermission = requiredRoles.some((role) => {
      return roles.some((userRole) => {
        return userRole.name === role
      })
    })

    if (!hasPermission) {
      return res.status(403).json({ message: 'Acesso negado' })
    }

    next()
  }
}

module.exports = authorizationMiddleware
