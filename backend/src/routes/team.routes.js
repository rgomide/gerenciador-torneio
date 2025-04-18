const express = require('express')
const router = express.Router()
const teamController = require('../controllers/team.controller')
const authMiddleware = require('../middleware/auth.middleware')
const authorizationMiddleware = require('../middleware/authorization.middleware')
const { ROLES } = require('../config/roles')

// ... existing routes ...

// Team-Player relationship routes
router.post(
  '/:teamId/players/:playerId',
  authMiddleware,
  authorizationMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  teamController.addTeamPlayer
)

router.post(
  '/:teamId/players/bulk',
  authMiddleware,
  authorizationMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  teamController.bulkAddTeamPlayers
)

router.put(
  '/:teamId/players/:playerId',
  authMiddleware,
  authorizationMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  teamController.updateTeamPlayer
)

router.delete(
  '/:teamId/players/:playerId',
  authMiddleware,
  authorizationMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  teamController.removeTeamPlayer
)

// ... existing code ...

module.exports = router
