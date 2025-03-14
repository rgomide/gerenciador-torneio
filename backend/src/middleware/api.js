const router = require('express').Router({ mergeParams: true })

const usersController = require('@server/controllers/user.controller')
const authController = require('@server/controllers/auth.controller')
const loggerMiddleware = require('@server/middleware/logger')
const authMiddleware = require('@server/middleware/auth')

router.use(loggerMiddleware)
router.use(authMiddleware)

router.use('/users', usersController)
router.use('/auth', authController)

router.get('/ping', (req, res) => {
  res.send('pong')
})

module.exports = router
