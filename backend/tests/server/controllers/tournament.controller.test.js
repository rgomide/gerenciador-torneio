const request = require('supertest')
const {
  User,
  Role,
  Institution,
  Unit,
  Event,
  Tournament,
  Match,
  MatchSnapshot,
  Sport
} = require('@server/models')
const matchService = require('@server/services/match.service')
const app = require('@server/app')
const jwt = require('jsonwebtoken')
const { JWT, ROLES } = require('@server/config/constants')

describe('Tournament Controller', () => {
  describe('GET /api/tournaments', () => {
    it('should return all tournaments when user is admin', async () => {
      const adminRole = await Role.create({ name: ROLES.ADMIN })
      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        userName: 'admin',
        email: 'admin@example.com',
        password: 'password123'
      })
      await adminRole.addUser(adminUser, {
        through: { userId: adminUser.id, roleId: adminRole.id }
      })
      const adminToken = jwt.sign({ id: adminUser.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      const institution = await Institution.create({ name: 'Test Institution' })

      const sport = await Sport.create({ name: 'Test Sport' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-01-02')

      await Tournament.create({
        sportId: sport.id,
        name: 'Tournament 1',
        eventId: event.id,
        finished: true,
        startDate,
        endDate
      })

      const response = await request(app)
        .get('/api/tournaments')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          name: 'Tournament 1',
          eventId: event.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          finished: true,
          sport: expect.objectContaining({
            id: sport.id,
            name: 'Test Sport'
          }),
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      ])
    })

    it('should return all tournaments when user is manager', async () => {
      const managerRole = await Role.create({ name: ROLES.MANAGER })
      const managerUser = await User.create({
        firstName: 'Manager',
        lastName: 'User',
        userName: 'manager',
        email: 'manager@example.com',
        password: 'password123'
      })
      await managerRole.addUser(managerUser, {
        through: { userId: managerUser.id, roleId: managerRole.id }
      })
      const managerToken = jwt.sign({ id: managerUser.id }, JWT.SECRET, {
        expiresIn: JWT.EXPIRES_IN
      })

      const institution = await Institution.create({ name: 'Test Institution' })
      const sport = await Sport.create({ name: 'Test Sport' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      await Tournament.create({
        sportId: sport.id,
        name: 'Tournament 1',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const response = await request(app)
        .get('/api/tournaments')
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(200)
    })

    it('should return 403 when no token is provided', async () => {
      const response = await request(app).get('/api/tournaments')

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('GET /api/events/:eventId/tournaments', () => {
    it('should return all tournaments of an event when user is admin', async () => {
      const adminRole = await Role.create({ name: ROLES.ADMIN })
      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        userName: 'admin',
        email: 'admin@example.com',
        password: 'password123'
      })
      await adminRole.addUser(adminUser, {
        through: { userId: adminUser.id, roleId: adminRole.id }
      })
      const adminToken = jwt.sign({ id: adminUser.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      const institution = await Institution.create({ name: 'Test Institution' })
      const sport = await Sport.create({ name: 'Test Sport' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-01-02')
      await Tournament.create({
        sportId: sport.id,
        name: 'Tournament 1',
        eventId: event.id,
        startDate,
        endDate
      })

      const response = await request(app)
        .get(`/api/events/${event.id}/tournaments`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          name: 'Tournament 1',
          eventId: event.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          sportId: sport.id,
          sport: expect.objectContaining({
            id: sport.id,
            name: 'Test Sport'
          }),
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      ])
    })

    it('should return all tournaments of an event when user is manager', async () => {
      const managerRole = await Role.create({ name: ROLES.MANAGER })
      const managerUser = await User.create({
        firstName: 'Manager',
        lastName: 'User',
        userName: 'manager',
        email: 'manager@example.com',
        password: 'password123'
      })
      await managerRole.addUser(managerUser, {
        through: { userId: managerUser.id, roleId: managerRole.id }
      })
      const managerToken = jwt.sign({ id: managerUser.id }, JWT.SECRET, {
        expiresIn: JWT.EXPIRES_IN
      })

      const institution = await Institution.create({ name: 'Test Institution' })
      const sport = await Sport.create({ name: 'Test Sport' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      await Tournament.create({
        sportId: sport.id,
        name: 'Tournament 1',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const response = await request(app)
        .get(`/api/events/${event.id}/tournaments`)
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(200)
    })

    it('should return 404 when event is not found', async () => {
      const adminRole = await Role.create({ name: ROLES.ADMIN })
      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        userName: 'admin',
        email: 'admin@example.com',
        password: 'password123'
      })
      await adminRole.addUser(adminUser, {
        through: { userId: adminUser.id, roleId: adminRole.id }
      })
      const adminToken = jwt.sign({ id: adminUser.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      const response = await request(app)
        .get('/api/events/999999/tournaments')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Evento não encontrado')
    })

    it('should return 403 when no token is provided', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const response = await request(app).get(`/api/events/${event.id}/tournaments`)

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('GET /api/tournaments/:tournamentId', () => {
    it('should return tournament by id when user is admin', async () => {
      const adminRole = await Role.create({ name: ROLES.ADMIN })
      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        userName: 'admin',
        email: 'admin@example.com',
        password: 'password123'
      })
      await adminRole.addUser(adminUser, {
        through: { userId: adminUser.id, roleId: adminRole.id }
      })
      const adminToken = jwt.sign({ id: adminUser.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      const institution = await Institution.create({ name: 'Test Institution' })
      const sport = await Sport.create({ name: 'Test Sport' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-01-02')
      const tournament = await Tournament.create({
        sportId: sport.id,
        name: 'Tournament 1',
        eventId: event.id,
        startDate,
        endDate
      })

      const response = await request(app)
        .get(`/api/tournaments/${tournament.id}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          id: tournament.id,
          name: 'Tournament 1',
          eventId: event.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      )
    })

    it('should return 404 when tournament is not found', async () => {
      const adminRole = await Role.create({ name: ROLES.ADMIN })
      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        userName: 'admin',
        email: 'admin@example.com',
        password: 'password123'
      })
      await adminRole.addUser(adminUser, {
        through: { userId: adminUser.id, roleId: adminRole.id }
      })
      const adminToken = jwt.sign({ id: adminUser.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      const response = await request(app)
        .get('/api/tournaments/999999')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Torneio não encontrado')
    })

    it('should return 403 when no token is provided', async () => {
      const response = await request(app).get('/api/tournaments/1')

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('POST /api/tournaments', () => {
    it('should create a tournament when user is admin', async () => {
      const adminRole = await Role.create({ name: ROLES.ADMIN })
      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        userName: 'admin',
        email: 'admin@example.com',
        password: 'password123'
      })
      await adminRole.addUser(adminUser, {
        through: { userId: adminUser.id, roleId: adminRole.id }
      })
      const adminToken = jwt.sign({ id: adminUser.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      const institution = await Institution.create({ name: 'Test Institution' })
      const sport = await Sport.create({ name: 'Test Sport' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const tournamentData = {
        name: 'New Tournament',
        eventId: event.id,
        sportId: sport.id,
        finished: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      }

      const response = await request(app)
        .post('/api/tournaments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(tournamentData)

      expect(response.status).toBe(201)
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: tournamentData.name,
          eventId: event.id,
          startDate: tournamentData.startDate.toISOString(),
          endDate: tournamentData.endDate.toISOString(),
          finished: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      )
    })

    it('should return 400 when required fields are missing', async () => {
      const adminRole = await Role.create({ name: ROLES.ADMIN })
      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        userName: 'admin',
        email: 'admin@example.com',
        password: 'password123'
      })
      await adminRole.addUser(adminUser, {
        through: { userId: adminUser.id, roleId: adminRole.id }
      })
      const adminToken = jwt.sign({ id: adminUser.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      const response = await request(app)
        .post('/api/tournaments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Tournament',
          eventId: '999999',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-02')
        })

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Evento não encontrado')
    })

    it('should return 404 when event does not exist', async () => {
      const adminRole = await Role.create({ name: ROLES.ADMIN })
      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        userName: 'admin',
        email: 'admin@example.com',
        password: 'password123'
      })
      await adminRole.addUser(adminUser, {
        through: { userId: adminUser.id, roleId: adminRole.id }
      })
      const adminToken = jwt.sign({ id: adminUser.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      const tournamentData = {
        name: 'New Tournament',
        eventId: '999999',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      }

      const response = await request(app)
        .post('/api/tournaments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(tournamentData)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Evento não encontrado')
    })

    it('should return 403 when no token is provided', async () => {
      const response = await request(app).post('/api/tournaments').send({})

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('POST /api/tournaments/:tournamentId/finish', () => {
    it('should finish a tournament when user is admin', async () => {
      const adminRole = await Role.create({ name: ROLES.ADMIN })
      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        userName: 'admin',
        email: 'admin@example.com',
        password: 'password123'
      })
      await adminRole.addUser(adminUser, {
        through: { userId: adminUser.id, roleId: adminRole.id }
      })
      const adminToken = jwt.sign({ id: adminUser.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      const institution = await Institution.create({ name: 'Test Institution' })
      const sport = await Sport.create({ name: 'Test Sport' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
        sportId: sport.id,
        name: 'Tournament 1',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date('2024-01-01'),
        finished: false
      })

      await matchService.finish(match.id)

      const response = await request(app)
        .post(`/api/tournaments/${tournament.id}/finish`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)

      expect(response.body).toEqual(
        expect.objectContaining({
          id: tournament.id,
          finished: true
        })
      )

      const foundTournament = await Tournament.findByPk(tournament.id)
      expect(foundTournament.finished).toBe(true)

      const matchSnapshot = await MatchSnapshot.findOne({
        where: { tournamentId: tournament.id }
      })

      expect(matchSnapshot.toJSON()).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          matchId: match.id,
          matchDate: new Date('2024-01-01T00:00:00.000Z'),
          matchLocation: null,
          matchRoundNumber: null,
          matchOccurrences: null,
          tournamentId: tournament.id,
          tournamentName: 'Tournament 1',
          tournamentStartDate: new Date('2024-01-01T00:00:00.000Z'),
          tournamentEndDate: new Date('2024-01-02T00:00:00.000Z'),
          tournamentFinished: true,
          eventId: event.id,
          eventName: 'Test Event',
          eventStartDate: new Date('2024-01-01T00:00:00.000Z'),
          eventEndDate: new Date('2024-01-02T00:00:00.000Z'),
          unitId: unit.id,
          unitName: 'Test Unit',
          institutionId: institution.id,
          institutionName: 'Test Institution',
          sportId: sport.id,
          sportName: 'Test Sport',
          totalScores: [],
          matchScores: [],
          matchParticipants: [],
          snapshotTakenAt: expect.any(Date),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      )
    })

    it('should not finish a tournament when there are unfinished matches', async () => {
      const adminRole = await Role.create({ name: ROLES.ADMIN })
      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        userName: 'admin',
        email: 'admin@example.com',
        password: 'password123'
      })
      await adminRole.addUser(adminUser, {
        through: { userId: adminUser.id, roleId: adminRole.id }
      })
      const adminToken = jwt.sign({ id: adminUser.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      const institution = await Institution.create({ name: 'Test Institution' })
      const sport = await Sport.create({ name: 'Test Sport' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
        sportId: sport.id,
        name: 'Tournament 1',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date('2024-01-01'),
        finished: false
      })

      const response = await request(app)
        .post(`/api/tournaments/${tournament.id}/finish`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(400)
      expect(response.body.message).toBe(
        'Torneio não pode ser finalizado pois existem partidas não finalizadas'
      )

      const foundTournament = await Tournament.findByPk(tournament.id)
      expect(foundTournament.finished).toBe(false)

      const matchSnapshot = await MatchSnapshot.findOne({
        where: { tournamentId: tournament.id }
      })

      expect(matchSnapshot).toBeNull()
    })

    it('should not finish a tournament when it is already finished', async () => {
      const adminRole = await Role.create({ name: ROLES.ADMIN })
      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        userName: 'admin',
        email: 'admin@example.com',
        password: 'password123'
      })
      await adminRole.addUser(adminUser, {
        through: { userId: adminUser.id, roleId: adminRole.id }
      })
      const adminToken = jwt.sign({ id: adminUser.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      const institution = await Institution.create({ name: 'Test Institution' })
      const sport = await Sport.create({ name: 'Test Sport' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
        sportId: sport.id,
        name: 'Tournament 1',
        eventId: event.id,
        finished: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      await Match.create({
        tournamentId: tournament.id,
        date: new Date('2024-01-01'),
        finished: true
      })

      const response = await request(app)
        .post(`/api/tournaments/${tournament.id}/finish`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Torneio já finalizado')

      const foundTournament = await Tournament.findByPk(tournament.id)
      expect(foundTournament.finished).toBe(true)

      const matchSnapshot = await MatchSnapshot.findOne({
        where: { tournamentId: tournament.id }
      })

      expect(matchSnapshot).toBeNull()
    })
  })

  describe('PUT /api/tournaments/:tournamentId', () => {
    it('should update a tournament when user is admin', async () => {
      const adminRole = await Role.create({ name: ROLES.ADMIN })
      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        userName: 'admin',
        email: 'admin@example.com',
        password: 'password123'
      })
      await adminRole.addUser(adminUser, {
        through: { userId: adminUser.id, roleId: adminRole.id }
      })
      const adminToken = jwt.sign({ id: adminUser.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      const institution = await Institution.create({ name: 'Test Institution' })
      const sport = await Sport.create({ name: 'Test Sport' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
        sportId: sport.id,
        name: 'Tournament 1',
        eventId: event.id,
        finished: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const updatedData = {
        name: 'Updated Tournament',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-02'),
        finished: false
      }

      const response = await request(app)
        .put(`/api/tournaments/${tournament.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedData)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          id: tournament.id,
          name: updatedData.name,
          eventId: event.id,
          startDate: updatedData.startDate.toISOString(),
          endDate: updatedData.endDate.toISOString(),
          finished: true,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      )
    })

    it('should return 404 when tournament is not found', async () => {
      const adminRole = await Role.create({ name: ROLES.ADMIN })
      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        userName: 'admin',
        email: 'admin@example.com',
        password: 'password123'
      })
      await adminRole.addUser(adminUser, {
        through: { userId: adminUser.id, roleId: adminRole.id }
      })
      const adminToken = jwt.sign({ id: adminUser.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      const updatedData = {
        name: 'Updated Tournament',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      }

      const response = await request(app)
        .put('/api/tournaments/999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedData)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Torneio não encontrado')
    })

    it('should return 404 when updating to non-existent event', async () => {
      const adminRole = await Role.create({ name: ROLES.ADMIN })
      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        userName: 'admin',
        email: 'admin@example.com',
        password: 'password123'
      })
      await adminRole.addUser(adminUser, {
        through: { userId: adminUser.id, roleId: adminRole.id }
      })
      const adminToken = jwt.sign({ id: adminUser.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      const institution = await Institution.create({ name: 'Test Institution' })
      const sport = await Sport.create({ name: 'Test Sport' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
        sportId: sport.id,
        name: 'Tournament 1',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const updatedData = {
        eventId: '999999',
        name: 'Updated Tournament',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      }

      const response = await request(app)
        .put(`/api/tournaments/${tournament.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedData)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Evento não encontrado')
    })

    it('should return 403 when no token is provided', async () => {
      const response = await request(app).put('/api/tournaments/1').send({})

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('DELETE /api/tournaments/:tournamentId', () => {
    it('should delete a tournament when user is admin', async () => {
      const adminRole = await Role.create({ name: ROLES.ADMIN })
      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        userName: 'admin',
        email: 'admin@example.com',
        password: 'password123'
      })
      await adminRole.addUser(adminUser, {
        through: { userId: adminUser.id, roleId: adminRole.id }
      })
      const adminToken = jwt.sign({ id: adminUser.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      const institution = await Institution.create({ name: 'Test Institution' })
      const sport = await Sport.create({ name: 'Test Sport' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
        sportId: sport.id,
        name: 'Tournament 1',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const response = await request(app)
        .delete(`/api/tournaments/${tournament.id}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(204)

      const foundTournament = await Tournament.findByPk(tournament.id)
      expect(foundTournament).toBeNull()
    })

    it('should return 404 when tournament is not found', async () => {
      const adminRole = await Role.create({ name: ROLES.ADMIN })
      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        userName: 'admin',
        email: 'admin@example.com',
        password: 'password123'
      })
      await adminRole.addUser(adminUser, {
        through: { userId: adminUser.id, roleId: adminRole.id }
      })
      const adminToken = jwt.sign({ id: adminUser.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      const response = await request(app)
        .delete('/api/tournaments/999999')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Torneio não encontrado')
    })

    it('should return 403 when no token is provided', async () => {
      const response = await request(app).delete('/api/tournaments/1')

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('GET /api/tournaments/:tournamentId/matches', () => {
    it('should return all matches of a tournament when user is admin', async () => {
      const adminRole = await Role.create({ name: ROLES.ADMIN })
      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        userName: 'admin',
        email: 'admin@example.com',
        password: 'password123'
      })
      await adminRole.addUser(adminUser, {
        through: { userId: adminUser.id, roleId: adminRole.id }
      })
      const adminToken = jwt.sign({ id: adminUser.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      const institution = await Institution.create({ name: 'Test Institution' })
      const sport = await Sport.create({ name: 'Test Sport' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
        sportId: sport.id,
        name: 'Tournament 1',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date('2024-01-01'),
        location: 'Test Location',
        finished: false,
        occurrences: 'Test Occurrences',
        roundNumber: 1
      })

      const response = await request(app)
        .get(`/api/tournaments/${tournament.id}/matches`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        expect.objectContaining({
          id: match.id,
          tournamentId: tournament.id,
          date: match.date.toISOString(),
          location: 'Test Location',
          finished: false,
          occurrences: 'Test Occurrences',
          roundNumber: 1,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      ])
    })

    it('should return all matches of a tournament when user is manager', async () => {
      const managerRole = await Role.create({ name: ROLES.MANAGER })
      const managerUser = await User.create({
        firstName: 'Manager',
        lastName: 'User',
        userName: 'manager',
        email: 'manager@example.com',
        password: 'password123'
      })
      await managerRole.addUser(managerUser, {
        through: { userId: managerUser.id, roleId: managerRole.id }
      })
      const managerToken = jwt.sign({ id: managerUser.id }, JWT.SECRET, {
        expiresIn: JWT.EXPIRES_IN
      })

      const institution = await Institution.create({ name: 'Test Institution' })
      const sport = await Sport.create({ name: 'Test Sport' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
        sportId: sport.id,
        name: 'Tournament 1',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      await Match.create({
        tournamentId: tournament.id,
        date: new Date('2024-01-01'),
        location: 'Test Location',
        finished: false,
        occurrences: 'Test Occurrences',
        roundNumber: 1
      })

      const response = await request(app)
        .get(`/api/tournaments/${tournament.id}/matches`)
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(200)
    })

    it('should return 404 when tournament is not found', async () => {
      const adminRole = await Role.create({ name: ROLES.ADMIN })
      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        userName: 'admin',
        email: 'admin@example.com',
        password: 'password123'
      })
      await adminRole.addUser(adminUser, {
        through: { userId: adminUser.id, roleId: adminRole.id }
      })
      const adminToken = jwt.sign({ id: adminUser.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      const response = await request(app)
        .get('/api/tournaments/999999/matches')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Torneio não encontrado')
    })

    it('should return 403 when no token is provided', async () => {
      const response = await request(app).get('/api/tournaments/1/matches')

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })
})
