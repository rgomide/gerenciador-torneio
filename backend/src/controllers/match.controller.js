const { create, findAll, findById, update, remove } = require('@server/services/match.service')
const {
  findByMatch,
  remove: removeParticipant
} = require('@server/services/matchParticipant.service')
const router = require('express').Router({ mergeParams: true })
const authorizationMiddleware = require('@server/middleware/authorization')
const {
  ROLES: { ADMIN, MANAGER }
} = require('@server/config/constants')

const MatchVO = require('@server/vo/MatchVO')
const MatchParticipantVO = require('@server/vo/MatchParticipantVO')

/**
 * @openapi
 * /api/matches:
 *   get:
 *     description: Get all matches
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of matches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   tournamentId:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   location:
 *                     type: string
 *                   finished:
 *                     type: boolean
 *                   occurrences:
 *                     type: string
 *                   roundNumber:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
router.get('/matches', authorizationMiddleware([ADMIN, MANAGER]), async (req, res, next) => {
  try {
    const matches = await findAll()
    const matchesVO = MatchVO.parseCollection(matches)

    return res.json(matchesVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/matches/{matchId}:
 *   get:
 *     description: Get a match by ID
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: matchId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Match found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 tournamentId:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 location:
 *                   type: string
 *                 finished:
 *                   type: boolean
 *                 occurrences:
 *                   type: string
 *                 roundNumber:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */
router.get(
  '/matches/:matchId',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const { matchId } = req.params
      const match = await findById(matchId)

      if (!match) {
        return res.status(404).json({ error: 'Partida não encontrada' })
      }

      const matchVO = new MatchVO(match)
      return res.json(matchVO)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @openapi
 * /api/matches:
 *   post:
 *     description: Create a new match
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tournamentId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               finished:
 *                 type: boolean
 *               occurrences:
 *                 type: string
 *               roundNumber:
 *                 type: integer
 *             required:
 *               - tournamentId
 *               - date
 *               - location
 *               - roundNumber
 *     responses:
 *       201:
 *         description: Match created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 tournamentId:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 location:
 *                   type: string
 *                 finished:
 *                   type: boolean
 *                 occurrences:
 *                   type: string
 *                 roundNumber:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */
router.post('/matches', authorizationMiddleware([ADMIN]), async (req, res, next) => {
  try {
    const match = await create(req.body)
    const matchVO = new MatchVO(match)

    return res.status(201).json(matchVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/matches/{matchId}:
 *   put:
 *     description: Update a match
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: matchId
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
 *               tournamentId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               finished:
 *                 type: boolean
 *               occurrences:
 *                 type: string
 *               roundNumber:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Match updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 tournamentId:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 location:
 *                   type: string
 *                 finished:
 *                   type: boolean
 *                 occurrences:
 *                   type: string
 *                 roundNumber:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */
router.put(
  '/matches/:matchId',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const { matchId } = req.params
      const match = await update(matchId, req.body)
      const matchVO = new MatchVO(match)

      return res.json(matchVO)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @openapi
 * /api/matches/{matchId}:
 *   delete:
 *     description: Delete a match
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: matchId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Match deleted successfully
 */
router.delete('/matches/:matchId', authorizationMiddleware([ADMIN]), async (req, res, next) => {
  try {
    const { matchId } = req.params
    await remove(matchId)

    return res.status(204).send()
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/matches/{matchId}/participants:
 *   get:
 *     description: Get all participants for a specific match
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: matchId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of match participants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   matchId:
 *                     type: string
 *                   participantType:
 *                     type: string
 *                     enum: [team, player]
 *                   teamId:
 *                     type: string
 *                     nullable: true
 *                   playerId:
 *                     type: string
 *                     nullable: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Match not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get(
  '/matches/:matchId/participants',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const { matchId } = req.params
      const participants = await findByMatch(matchId)
      const participantsVO = MatchParticipantVO.parseCollection(participants)

      return res.json(participantsVO)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @openapi
 * /api/matches/{matchId}/participants/{participantId}:
 *   delete:
 *     description: Delete a specific participant from a match
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: matchId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: participantId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Participant successfully removed from match
 *       404:
 *         description: Match or participant not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.delete(
  '/matches/:matchId/participants/:participantId',
  authorizationMiddleware([ADMIN]),
  async (req, res, next) => {
    try {
      const { matchId, participantId } = req.params
      await removeParticipant(participantId)

      return res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
)

module.exports = router
