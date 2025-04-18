const {
  create,
  findAll,
  findById,
  findByUnit,
  findBySport,
  update,
  remove
} = require('@server/services/team.service')
const { findByTeam } = require('@server/services/player.service')
const router = require('express').Router({ mergeParams: true })
const authorizationMiddleware = require('@server/middleware/authorization')
const {
  ROLES: { ADMIN, MANAGER }
} = require('@server/config/constants')

const TeamVO = require('@server/vo/TeamVO')
const PlayerVO = require('@server/vo/PlayerVO')
const TeamPlayerVO = require('@server/vo/TeamPlayerVO')
const teamPlayerService = require('@server/services/teamPlayer.service')

/**
 * @openapi
 * /api/teams:
 *   get:
 *     description: Get all teams
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of teams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   unitId:
 *                     type: string
 *                   sportId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
router.get('/teams', authorizationMiddleware([ADMIN, MANAGER]), async (req, res, next) => {
  try {
    const teams = await findAll()
    const teamsVO = TeamVO.parseCollection(teams)

    return res.json(teamsVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/teams/{teamId}:
 *   get:
 *     description: Get a team by ID
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: teamId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 unitId:
 *                   type: string
 *                 sportId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */
router.get('/teams/:teamId', authorizationMiddleware([ADMIN, MANAGER]), async (req, res, next) => {
  try {
    const { teamId } = req.params
    const team = await findById(teamId)

    const teamVO = new TeamVO(team)
    return res.json(teamVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/units/{unitId}/teams:
 *   get:
 *     description: Get all teams for a unit
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: unitId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of teams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   unitId:
 *                     type: string
 *                   sportId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
router.get(
  '/units/:unitId/teams',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const { unitId } = req.params
      const teams = await findByUnit(unitId)
      const teamsVO = TeamVO.parseCollection(teams)

      return res.json(teamsVO)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @openapi
 * /api/sports/{sportId}/teams:
 *   get:
 *     description: Get all teams for a sport
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: sportId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of teams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   unitId:
 *                     type: string
 *                   sportId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
router.get(
  '/sports/:sportId/teams',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const { sportId } = req.params
      const teams = await findBySport(sportId)
      const teamsVO = TeamVO.parseCollection(teams)

      return res.json(teamsVO)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @openapi
 * /api/teams:
 *   post:
 *     description: Create a new team
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               unitId:
 *                 type: string
 *               sportId:
 *                 type: string
 *             required:
 *               - name
 *               - unitId
 *               - sportId
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 unitId:
 *                   type: string
 *                 sportId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */
router.post('/teams', authorizationMiddleware([ADMIN, MANAGER]), async (req, res, next) => {
  try {
    const { name, unitId, sportId } = req.body
    const team = await create({ name, unitId, sportId })

    const teamVO = new TeamVO(team)
    return res.status(201).json(teamVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/teams/{teamId}:
 *   put:
 *     description: Update a team
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: teamId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               unitId:
 *                 type: string
 *               sportId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 unitId:
 *                   type: string
 *                 sportId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */
router.put('/teams/:teamId', authorizationMiddleware([ADMIN, MANAGER]), async (req, res, next) => {
  try {
    const { teamId } = req.params
    const { name, unitId, sportId } = req.body
    const team = await update(teamId, { name, unitId, sportId })

    const teamVO = new TeamVO(team)
    return res.json(teamVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/teams/{teamId}:
 *   delete:
 *     description: Delete a team
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: teamId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Team deleted successfully
 */
router.delete('/teams/:teamId', authorizationMiddleware([ADMIN]), async (req, res, next) => {
  try {
    const { teamId } = req.params
    await remove(teamId)

    return res.status(204).send()
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/teams/{teamId}/players:
 *   get:
 *     description: Get all players in a team
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: teamId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of players in the team
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   unitId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
router.get(
  '/teams/:teamId/players',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const { teamId } = req.params
      const players = await findByTeam(teamId)
      const playersVO = PlayerVO.parseCollection(players)

      return res.json(playersVO)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @openapi
 * /api/teams/{teamId}/players/{playerId}:
 *   post:
 *     description: Add a player to a team
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: teamId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: playerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: integer
 *               position:
 *                 type: string
 *     responses:
 *       201:
 *         description: Player added to team successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 teamId:
 *                   type: string
 *                 playerId:
 *                   type: string
 *                 number:
 *                   type: integer
 *                 position:
 *                   type: string
 *       404:
 *         description: Team or player not found
 *       400:
 *         description: Player already in team
 */
router.post(
  '/teams/:teamId/players/:playerId',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const { teamId, playerId } = req.params
      const { details } = req.body

      const teamPlayer = await teamPlayerService.create({
        teamId,
        playerId,
        details
      })

      const teamPlayerVO = new TeamPlayerVO(teamPlayer)

      return res.status(201).json(teamPlayerVO)
    } catch (error) {
      next(error)
    }
  }
)

module.exports = router
