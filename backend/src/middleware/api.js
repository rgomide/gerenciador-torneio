const router = require('express').Router({ mergeParams: true })

const usersController = require('@server/controllers/user.controller')
const authController = require('@server/controllers/auth.controller')
const loggerMiddleware = require('@server/middleware/logger')
const authMiddleware = require('@server/middleware/auth')
const institutionController = require('@server/controllers/institution.controller')
const unitController = require('@server/controllers/unit.controller')
const eventController = require('@server/controllers/event.controller')

router.use(loggerMiddleware)
router.use(authMiddleware)

router.use('/users', usersController)
router.use('/auth', authController)
router.use('/institutions', institutionController)
router.use('/', unitController)
router.use('/', eventController)

router.get('/ping', (req, res) => {
  res.send('pong')
})

module.exports = router
