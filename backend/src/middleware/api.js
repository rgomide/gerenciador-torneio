const router = require('express').Router({ mergeParams: true })

const usersController = require('@server/controllers/user.controller')
const authController = require('@server/controllers/auth.controller')
const loggerMiddleware = require('@server/middleware/logger')
const authMiddleware = require('@server/middleware/auth')
const institutionController = require('@server/controllers/institution.controller')
const unitController = require('@server/controllers/unit.controller')
const eventController = require('@server/controllers/event.controller')
const tournamentController = require('@server/controllers/tournament.controller')
const sportController = require('@server/controllers/sport.controller')
const playerController = require('@server/controllers/player.controller')
const teamController = require('@server/controllers/team.controller')
const matchController = require('@server/controllers/match.controller')

router.use(loggerMiddleware)
router.use(authMiddleware)

router.use('/users', usersController)
router.use('/auth', authController)
router.use('/institutions', institutionController)
router.use('/', unitController)
router.use('/', eventController)
router.use('/', tournamentController)
router.use('/sports', sportController)
router.use('/', playerController)
router.use('/', teamController)
router.use('/', matchController)

router.get('/ping', (req, res) => {
  res.send('pong')
})

module.exports = router
