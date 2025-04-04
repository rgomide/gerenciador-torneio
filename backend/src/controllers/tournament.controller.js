const {
  create,
  findAll,
  findById,
  findByEvent,
  update,
  remove
} = require('@server/services/tournament.service')
const router = require('express').Router({ mergeParams: true })
const authorizationMiddleware = require('@server/middleware/authorization')
const {
  ROLES: { ADMIN, MANAGER }
} = require('@server/config/constants')

const TournamentVO = require('@server/vo/TournamentVO')

/**
 * @openapi
 * /api/tournaments:
 *   get:
 *     description: Get all tournaments
 *     tags:
 *       - Tournaments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tournaments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               example:
 *                 - id: "1"
 *                   name: "Tournament 1"
 *                   eventId: "1"
 *                   startDate: "2024-01-01T00:00:00.000Z"
 *                   endDate: "2024-01-02T00:00:00.000Z"
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *                   updatedAt: "2024-01-01T00:00:00.000Z"
 */
router.get('/tournaments', authorizationMiddleware([ADMIN, MANAGER]), async (req, res, next) => {
  try {
    const tournaments = await findAll()
    const tournamentsVO = TournamentVO.parseCollection(tournaments)

    return res.json(tournamentsVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/events/{eventId}/tournaments:
 *   get:
 *     description: Get all tournaments of an event
 *     tags:
 *       - Tournaments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tournaments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               example:
 *                 - id: "1"
 *                   name: "Tournament 1"
 *                   eventId: "1"
 *                   startDate: "2024-01-01T00:00:00.000Z"
 *                   endDate: "2024-01-02T00:00:00.000Z"
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *                   updatedAt: "2024-01-01T00:00:00.000Z"
 */
router.get(
  '/events/:eventId/tournaments',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const { eventId } = req.params
      const tournaments = await findByEvent(eventId)
      const tournamentsVO = TournamentVO.parseCollection(tournaments)

      return res.json(tournamentsVO)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @openapi
 * /api/tournaments/{tournamentId}:
 *   get:
 *     description: Get a tournament by ID
 *     tags:
 *       - Tournaments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: tournamentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tournament found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 eventId:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 */
router.get(
  '/tournaments/:tournamentId',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const { tournamentId } = req.params
      const tournament = await findById(tournamentId)

      if (!tournament) {
        return res.status(404).json({ error: 'Tournament not found' })
      }

      const tournamentVO = new TournamentVO(tournament)
      return res.json(tournamentVO)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @openapi
 * /api/tournaments:
 *   post:
 *     description: Create a new tournament
 *     tags:
 *       - Tournaments
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
 *               eventId:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *             required:
 *               - name
 *               - eventId
 *               - startDate
 *               - endDate
 *     responses:
 *       201:
 *         description: Tournament created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 eventId:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 */
router.post('/tournaments', authorizationMiddleware([ADMIN]), async (req, res, next) => {
  try {
    const tournament = await create(req.body)
    const tournamentVO = new TournamentVO(tournament)

    return res.status(201).json(tournamentVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/tournaments/{tournamentId}:
 *   put:
 *     description: Update a tournament
 *     tags:
 *       - Tournaments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: tournamentId
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
 *               eventId:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Tournament updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 eventId:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 */
router.put(
  '/tournaments/:tournamentId',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const { tournamentId } = req.params
      const tournament = await update(tournamentId, req.body)
      const tournamentVO = new TournamentVO(tournament)

      return res.json(tournamentVO)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @openapi
 * /api/tournaments/{tournamentId}:
 *   delete:
 *     description: Delete a tournament
 *     tags:
 *       - Tournaments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: tournamentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Tournament deleted successfully
 */
router.delete(
  '/tournaments/:tournamentId',
  authorizationMiddleware([ADMIN]),
  async (req, res, next) => {
    try {
      const { tournamentId } = req.params
      await remove(tournamentId)

      return res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
)

module.exports = router
