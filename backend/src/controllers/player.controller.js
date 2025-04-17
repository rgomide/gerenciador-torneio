const {
  create,
  findAll,
  findById,
  findByUnit,
  update,
  remove
} = require('@server/services/player.service')
const router = require('express').Router({ mergeParams: true })
const authorizationMiddleware = require('@server/middleware/authorization')
const {
  ROLES: { ADMIN, MANAGER }
} = require('@server/config/constants')

const PlayerVO = require('@server/vo/PlayerVO')

/**
 * @openapi
 * /api/units/{unitId}/players:
 *   get:
 *     description: Get all players of a unit
 *     tags:
 *       - Players
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
 *         description: List of players
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
 *                   phone:
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
  '/units/:unitId/players',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const { unitId } = req.params
      const players = await findByUnit(unitId)
      const playersVO = PlayerVO.parseCollection(players)

      return res.json(playersVO)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @openapi
 * /api/players:
 *   get:
 *     description: Get all players
 *     tags:
 *       - Players
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of players
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
 *                   phone:
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
router.get('/players', authorizationMiddleware([ADMIN, MANAGER]), async (req, res, next) => {
  try {
    const players = await findAll()
    const playersVO = PlayerVO.parseCollection(players)

    return res.json(playersVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/players/{playerId}:
 *   get:
 *     description: Get a player by ID
 *     tags:
 *       - Players
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: playerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Player found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 unitId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */
router.get(
  '/players/:playerId',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const { playerId } = req.params
      const player = await findById(playerId)
      const playerVO = new PlayerVO(player)

      return res.json(playerVO)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @openapi
 * /api/players:
 *   post:
 *     description: Create a new player
 *     tags:
 *       - Players
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
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               unitId:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - unitId
 *     responses:
 *       201:
 *         description: Player created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 unitId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */
router.post('/players', authorizationMiddleware([ADMIN, MANAGER]), async (req, res, next) => {
  try {
    const { name, email, phone, unitId } = req.body
    const player = await create({ name, email, phone, unitId })
    const playerVO = new PlayerVO(player)

    return res.status(201).json(playerVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/players/{playerId}:
 *   put:
 *     description: Update a player by ID
 *     tags:
 *       - Players
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               unitId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Player updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 unitId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */
router.put(
  '/players/:playerId',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const { playerId } = req.params
      const { name, email, phone, unitId } = req.body
      const player = await update(playerId, { name, email, phone, unitId })
      const playerVO = new PlayerVO(player)

      return res.json(playerVO)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @openapi
 * /api/players/{playerId}:
 *   delete:
 *     description: Delete a player by ID
 *     tags:
 *       - Players
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: playerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Player deleted successfully
 */
router.delete('/players/:playerId', authorizationMiddleware([ADMIN]), async (req, res, next) => {
  try {
    const { playerId } = req.params
    await remove(playerId)

    return res.status(204).send()
  } catch (error) {
    next(error)
  }
})

module.exports = router
