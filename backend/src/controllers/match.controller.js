const {
  create,
  findAll,
  findById,
  update,
  remove,
  finish
} = require('@server/services/match.service')
const matchParticipantService = require('@server/services/matchParticipant.service')
const router = require('express').Router({ mergeParams: true })
const authorizationMiddleware = require('@server/middleware/authorization')
const {
  ROLES: { ADMIN, MANAGER }
} = require('@server/config/constants')

const MatchVO = require('@server/vo/MatchVO')
const MatchParticipantVO = require('@server/vo/MatchParticipantVO')
const MatchScoreVO = require('@server/vo/MatchScoreVO')
const matchScoreService = require('@server/services/matchScore.service')

/**
 * @openapi
 * /api/matches:
 *   get:
 *     description: Get all matches
 *     tags:
 *       - Matches
 *       - Managers
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
 *       - Managers
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
 *       - Managers
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
router.post('/matches', authorizationMiddleware([ADMIN, MANAGER]), async (req, res, next) => {
  try {
    const matchData = req.body
    matchData.finished = false
    const user = req.user
    const match = await create(matchData, user)
    const matchVO = new MatchVO(match)

    return res.status(201).json(matchVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/matches/{matchId}/finish:
 *   post:
 *     description: Finish a match
 *     tags:
 *       - Matches
 *       - Managers
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
 *         description: Match finished successfully
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
router.post(
  '/matches/:matchId/finish',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const user = req.user
      const { matchId } = req.params
      const match = await finish(matchId, user)
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
 *   put:
 *     description: Update a match
 *     tags:
 *       - Matches
 *       - Managers
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
      const user = req.user
      const { matchId } = req.params
      const matchData = req.body

      delete matchData.finished

      const match = await update(matchId, matchData, user)
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
 *       - Managers
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
      const participants = await matchParticipantService.findByMatch(matchId)
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
 *       - Managers
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
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const user = req.user
      const { participantId } = req.params
      await matchParticipantService.remove(participantId, user)

      return res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @swagger
 * /api/matches/{matchId}/participants/bulk:
 *   post:
 *     summary: Create multiple participants for a match
 *     tags:
 *       - Matches
 *       - Managers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - participantType
 *               properties:
 *                 participantType:
 *                   type: string
 *                   enum: [team, player]
 *                 teamId:
 *                   type: string
 *                 playerId:
 *                   type: string
 *     responses:
 *       201:
 *         description: Participants created successfully
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
 *                   playerId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Match not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post(
  '/matches/:matchId/participants/bulk',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const user = req.user
      const { matchId } = req.params
      const participantsData = req.body.map((participant) => ({
        ...participant,
        matchId
      }))

      const participants = await matchParticipantService.bulkCreate(participantsData, user)
      const participantsVO = participants.map((participant) => new MatchParticipantVO(participant))

      res.status(201).json(participantsVO)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @swagger
 * /api/matches/{matchId}/participants:
 *   post:
 *     summary: Create a single participant for a match
 *     tags:
 *       - Matches
 *       - Managers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participantType
 *             properties:
 *               participantType:
 *                 type: string
 *                 enum: [team, player]
 *               teamId:
 *                 type: string
 *               playerId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Participant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 matchId:
 *                   type: string
 *                 participantType:
 *                   type: string
 *                   enum: [team, player]
 *                 teamId:
 *                   type: string
 *                 playerId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Match not found
 */
router.post(
  '/matches/:matchId/participants',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const user = req.user
      const { matchId } = req.params
      const participantData = {
        ...req.body,
        matchId
      }

      const participant = await matchParticipantService.create(participantData, user)
      const participantVO = new MatchParticipantVO(participant)

      return res.status(201).json(participantVO)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @swagger
 * /api/matches/{matchId}/scores:
 *   get:
 *     summary: Get all scores for a match
 *     tags:
 *       - Matches
 *       - Managers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of scores for the match
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
 *                   score:
 *                     type: number
 *                   details:
 *                     type: string
 *                     nullable: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Match not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get(
  '/matches/:matchId/scores',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const { matchId } = req.params
      const scores = await matchScoreService.findByMatch(matchId)
      const scoresVO = scores.map((score) => new MatchScoreVO(score))

      return res.json(scoresVO)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @swagger
 * /api/matches/{matchId}/scores:
 *   post:
 *     summary: Create a score for a match
 *     tags:
 *       - Matches
 *       - Managers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participantType
 *               - score
 *             properties:
 *               participantType:
 *                 type: string
 *                 enum: [team, player]
 *               teamId:
 *                 type: string
 *               playerId:
 *                 type: string
 *               score:
 *                 type: number
 *               details:
 *                 type: string
 *     responses:
 *       201:
 *         description: Score created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 matchId:
 *                   type: string
 *                 participantType:
 *                   type: string
 *                   enum: [team, player]
 *                 teamId:
 *                   type: string
 *                   nullable: true
 *                 playerId:
 *                   type: string
 *                   nullable: true
 *                 score:
 *                   type: number
 *                 details:
 *                   type: string
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Match not found
 */
router.post(
  '/matches/:matchId/scores',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const user = req.user
      const { matchId } = req.params
      const scoreData = {
        ...req.body,
        matchId
      }

      const score = await matchScoreService.create(scoreData, user)
      const scoreVO = new MatchScoreVO(score)

      return res.status(201).json(scoreVO)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @swagger
 * /api/matches/{matchId}/scores/{scoreId}:
 *   delete:
 *     summary: Delete a specific score from a match
 *     tags:
 *       - Matches
 *       - Managers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: scoreId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Score successfully removed from match
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Match or score not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete(
  '/matches/:matchId/scores/:scoreId',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const user = req.user
      const { scoreId } = req.params
      await matchScoreService.remove(scoreId, user)

      return res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @swagger
 * /api/matches/{matchId}/scores/{scoreId}:
 *   put:
 *     summary: Update a specific score for a match
 *     tags:
 *       - Matches
 *       - Managers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: scoreId
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
 *               score:
 *                 type: number
 *               details:
 *                 type: string
 *     responses:
 *       200:
 *         description: Score updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 matchId:
 *                   type: string
 *                 participantType:
 *                   type: string
 *                   enum: [team, player]
 *                 teamId:
 *                   type: string
 *                   nullable: true
 *                 playerId:
 *                   type: string
 *                   nullable: true
 *                 score:
 *                   type: number
 *                 details:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Match or score not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put(
  '/matches/:matchId/scores/:scoreId',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const user = req.user
      const { scoreId } = req.params
      const score = await matchScoreService.update(scoreId, req.body, user)
      const scoreVO = new MatchScoreVO(score)

      return res.json(scoreVO)
    } catch (error) {
      next(error)
    }
  }
)

module.exports = router
