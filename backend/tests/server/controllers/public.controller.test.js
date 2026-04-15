const request = require('supertest')
const {
  Institution,
  Unit,
  Event,
  Tournament,
  Match,
  Sport,
  MatchSnapshot,
  Team
} = require('@server/models')
const app = require('@server/app')

describe('Public Controller', () => {
  describe('GET /api/public/events', () => {
    it('should return all events for public listing without authentication', async () => {
      const institution = await Institution.create({ name: 'Inst Lista' })
      const unit = await Unit.create({ name: 'Unidade Lista', institutionId: institution.id })
      const event = await Event.create({
        name: 'Evento Lista',
        unitId: unit.id,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-10')
      })

      const response = await request(app).get('/api/public/events')

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBeGreaterThanOrEqual(1)
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: event.id,
            name: 'Evento Lista',
            unitName: 'Unidade Lista',
            institutionName: 'Inst Lista'
          })
        ])
      )
    })
  })

  describe('GET /api/public/events/:eventId', () => {
    it('should return public event summary without authentication', async () => {
      const institution = await Institution.create({ name: 'Inst Público' })
      const unit = await Unit.create({ name: 'Unidade Pública', institutionId: institution.id })
      const event = await Event.create({
        name: 'Campeonato Verão',
        unitId: unit.id,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-15')
      })

      const response = await request(app).get(`/api/public/events/${event.id}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        id: event.id,
        name: 'Campeonato Verão',
        startDate: event.startDate.toISOString(),
        endDate: event.endDate.toISOString(),
        unitName: 'Unidade Pública',
        institutionName: 'Inst Público'
      })
    })

    it('should return 404 when event does not exist', async () => {
      const response = await request(app).get('/api/public/events/999999')

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Evento não encontrado')
    })
  })

  describe('GET /api/public/events/:eventId/matches', () => {
    it('should return all matches of the event without authentication', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const sport = await Sport.create({ name: 'Test Sport' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-10')
      })
      const tournament = await Tournament.create({
        sportId: sport.id,
        name: 'Tournament A',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date('2024-01-05T14:00:00.000Z'),
        description: 'Final',
        location: 'Quadra 1',
        finished: false,
        occurrences: null,
        roundNumber: 1
      })

      const response = await request(app).get(`/api/public/events/${event.id}/matches`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        expect.objectContaining({
          id: match.id,
          tournamentId: tournament.id,
          tournamentName: 'Tournament A',
          tournamentFinished: false,
          sportName: 'Test Sport',
          snapshot: null,
          participants: [],
          date: match.date.toISOString(),
          description: 'Final',
          location: 'Quadra 1',
          finished: false,
          roundNumber: 1,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      ])
    })

    it('should return MatchSnapshotVO data for finished matches when snapshot exists', async () => {
      const institution = await Institution.create({ name: 'Inst Snap' })
      const sport = await Sport.create({ name: 'Sport Snap' })
      const unit = await Unit.create({ name: 'Unit Snap', institutionId: institution.id })
      const event = await Event.create({
        name: 'Event Snap',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-10')
      })
      const tournament = await Tournament.create({
        sportId: sport.id,
        name: 'Torneio Snap',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02'),
        finished: true
      })
      const team = await Team.create({
        name: 'Time Alpha',
        unitId: unit.id,
        sportId: sport.id
      })
      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date('2024-01-05T15:00:00.000Z'),
        description: 'Decisivo',
        location: 'Quadra central',
        finished: true,
        roundNumber: 2
      })

      await MatchSnapshot.create({
        matchId: match.id,
        matchDate: match.date,
        matchLocation: 'Quadra central',
        matchRoundNumber: 2,
        matchOccurrences: null,
        tournamentId: tournament.id,
        tournamentName: tournament.name,
        tournamentStartDate: tournament.startDate,
        tournamentEndDate: tournament.endDate,
        tournamentFinished: true,
        eventId: event.id,
        eventName: event.name,
        eventStartDate: event.startDate,
        eventEndDate: event.endDate,
        unitId: unit.id,
        unitName: unit.name,
        institutionId: institution.id,
        institutionName: institution.name,
        sportId: sport.id,
        sportName: sport.name,
        matchScores: [
          {
            participantType: 'team',
            id: String(team.id),
            name: 'Time Alpha',
            score: 5,
            details: 'Set 1'
          }
        ],
        matchParticipants: [
          {
            participantType: 'team',
            id: String(team.id),
            name: 'Time Alpha'
          }
        ],
        totalScores: [{ id: String(team.id), name: 'Time Alpha', totalScore: 10 }]
      })

      const response = await request(app).get(`/api/public/events/${event.id}/matches`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(1)
      expect(response.body[0].snapshot).toMatchObject({
        matchId: match.id,
        tournamentName: 'Torneio Snap',
        eventName: 'Event Snap',
        sportName: sport.name,
        matchParticipants: expect.arrayContaining([
          expect.objectContaining({ name: 'Time Alpha', participantType: 'team' })
        ]),
        totalScores: expect.arrayContaining([
          expect.objectContaining({ name: 'Time Alpha', totalScore: 10 })
        ])
      })
      expect(response.body[0].participants).toBeUndefined()
      expect(response.body[0].sportName).toBe('Sport Snap')
    })

    it('should return 404 when event does not exist', async () => {
      const response = await request(app).get('/api/public/events/999999/matches')

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Evento não encontrado')
    })

    it('should return empty array when event has no matches', async () => {
      const institution = await Institution.create({ name: 'Test Institution 2' })
      const unit = await Unit.create({ name: 'Test Unit 2', institutionId: institution.id })
      const event = await Event.create({
        name: 'Empty Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-10')
      })

      const response = await request(app).get(`/api/public/events/${event.id}/matches`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })
  })
})
