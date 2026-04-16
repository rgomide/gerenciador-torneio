const router = require('express').Router({ mergeParams: true })
const { findAllForPublic, findByIdForPublic } = require('@server/services/event.service')
const { findByEventForPublic } = require('@server/services/match.service')
const MatchVO = require('@server/vo/MatchVO')
const MatchSnapshotVO = require('@server/vo/MatchSnapshotVO')
const PublicEventVO = require('@server/vo/PublicEventVO')

/**
 * @openapi
 * /api/public/events:
 *   get:
 *     description: Lista todos os eventos (página pública, sem autenticação)
 *     tags:
 *       - Public
 *     responses:
 *       200:
 *         description: Lista de eventos
 */
router.get('/public/events', async (req, res, next) => {
  try {
    const events = await findAllForPublic()
    return res.json(PublicEventVO.parseCollection(events))
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/public/events/{eventId}:
 *   get:
 *     description: Dados resumidos do evento para página pública (sem autenticação)
 *     tags:
 *       - Public
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento encontrado
 *       404:
 *         description: Evento não encontrado
 */
router.get('/public/events/:eventId', async (req, res, next) => {
  try {
    const { eventId } = req.params
    const event = await findByIdForPublic(eventId)
    return res.json(new PublicEventVO(event).toJSON())
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/public/events/{eventId}/matches:
 *   get:
 *     description: Lista todas as partidas de um evento (acesso público, sem autenticação)
 *     tags:
 *       - Public
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de partidas do evento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Evento não encontrado
 */
router.get('/public/events/:eventId/matches', async (req, res, next) => {
  try {
    const { eventId } = req.params
    const { matches, snapshots } = await findByEventForPublic(eventId)

    const snapshotByMatchId = new Map(snapshots.map((row) => [String(row.matchId), row]))

    const matchesVO = matches.map((match) => {
      const base = new MatchVO(match).toJSON()
      const snapshotRow = match.finished ? snapshotByMatchId.get(String(match.id)) : null
      const snapshot = snapshotRow ? MatchSnapshotVO.fromPersistedSnapshot(snapshotRow) : null

      const participants = (match.participants || []).map((p) => ({
        participantType: p.participantType,
        name: p.team?.name || p.player?.name
      }))

      return {
        ...base,
        tournamentName: match.tournament ? match.tournament.name : null,
        tournamentFinished: match.tournament ? Boolean(match.tournament.finished) : false,
        sportName: match.tournament?.sport ? match.tournament.sport.name : null,
        snapshot,
        participants: snapshot ? undefined : participants
      }
    })

    return res.json(matchesVO)
  } catch (error) {
    next(error)
  }
})

module.exports = router
