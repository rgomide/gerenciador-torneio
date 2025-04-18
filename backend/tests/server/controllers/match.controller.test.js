const request = require('supertest')
const {
  User,
  Role,
  Institution,
  Unit,
  Event,
  Tournament,
  Match,
  MatchParticipant,
  Team,
  Player,
  Sport
} = require('@server/models')
const app = require('@server/app')
const jwt = require('jsonwebtoken')
const { JWT, ROLES } = require('@server/config/constants')

describe('Match Controller', () => {
  describe('GET /api/matches', () => {
    it('should return all matches when user is admin', async () => {
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
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
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
        .get('/api/matches')
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

    it('should return all matches when user is manager', async () => {
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
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
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
        .get('/api/matches')
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(200)
    })

    it('should return 403 when no token is provided', async () => {
      const response = await request(app).get('/api/matches')

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('GET /api/matches/:matchId', () => {
    it('should return match by id when user is admin', async () => {
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
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
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
        .get(`/api/matches/${match.id}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(
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
      )
    })

    it('should return 404 when match is not found', async () => {
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
        .get('/api/matches/999999')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Partida não encontrada')
    })

    it('should return 403 when no token is provided', async () => {
      const response = await request(app).get('/api/matches/1')

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('POST /api/matches', () => {
    it('should create a match when user is admin', async () => {
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
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
        name: 'Tournament 1',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const matchData = {
        tournamentId: tournament.id,
        date: new Date('2024-01-01'),
        location: 'Test Location',
        finished: false,
        occurrences: 'Test Occurrences',
        roundNumber: 1
      }

      const response = await request(app)
        .post('/api/matches')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(matchData)

      expect(response.status).toBe(201)
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          tournamentId: tournament.id,
          date: matchData.date.toISOString(),
          location: 'Test Location',
          finished: false,
          occurrences: 'Test Occurrences',
          roundNumber: 1,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      )
    })

    it('should return 404 when tournament does not exist', async () => {
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

      const matchData = {
        tournamentId: '999999',
        date: new Date('2024-01-01'),
        location: 'Test Location',
        finished: false,
        occurrences: 'Test Occurrences',
        roundNumber: 1
      }

      const response = await request(app)
        .post('/api/matches')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(matchData)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Torneio não encontrado')
    })

    it('should return 403 when no token is provided', async () => {
      const response = await request(app).post('/api/matches').send({})

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('PUT /api/matches/:matchId', () => {
    it('should update a match when user is admin', async () => {
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
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
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

      const updatedData = {
        location: 'Updated Location',
        finished: true,
        occurrences: 'Updated Occurrences',
        roundNumber: 2
      }

      const response = await request(app)
        .put(`/api/matches/${match.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedData)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          id: match.id,
          tournamentId: tournament.id,
          date: match.date.toISOString(),
          location: 'Updated Location',
          finished: true,
          occurrences: 'Updated Occurrences',
          roundNumber: 2,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      )
    })

    it('should return 404 when match is not found', async () => {
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
        location: 'Updated Location',
        finished: true,
        occurrences: 'Updated Occurrences',
        roundNumber: 2
      }

      const response = await request(app)
        .put('/api/matches/999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedData)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Partida não encontrada')
    })

    it('should return 403 when no token is provided', async () => {
      const response = await request(app).put('/api/matches/1').send({})

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('DELETE /api/matches/:matchId', () => {
    it('should delete a match when user is admin', async () => {
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
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
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
        .delete(`/api/matches/${match.id}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(204)

      const foundMatch = await Match.findByPk(match.id)
      expect(foundMatch).toBeNull()
    })

    it('should return 404 when match is not found', async () => {
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
        .delete('/api/matches/999999')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Partida não encontrada')
    })

    it('should return 403 when no token is provided', async () => {
      const response = await request(app).delete('/api/matches/1')

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('GET /api/matches/:matchId/participants', () => {
    it('should return match participants when user is admin', async () => {
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
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
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

      const sport = await Sport.create({
        name: 'Test Sport',
        description: 'Test Description'
      })

      const team = await Team.create({
        name: 'Test Team',
        description: 'Test Description',
        unitId: unit.id,
        sportId: sport.id
      })

      const player = await Player.create({
        name: 'Test Player',
        email: 'test@example.com',
        unitId: unit.id
      })

      const teamParticipant = await MatchParticipant.create({
        matchId: match.id,
        participantType: 'team',
        teamId: team.id
      })

      const playerParticipant = await MatchParticipant.create({
        matchId: match.id,
        participantType: 'player',
        playerId: player.id
      })

      const response = await request(app)
        .get(`/api/matches/${match.id}/participants`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        expect.objectContaining({
          id: teamParticipant.id,
          matchId: match.id,
          participantType: 'team',
          teamId: team.id,
          team: expect.objectContaining({
            id: team.id,
            name: team.name,
            unitId: team.unitId,
            sportId: team.sportId
          }),
          playerId: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }),
        expect.objectContaining({
          id: playerParticipant.id,
          matchId: match.id,
          participantType: 'player',
          teamId: null,
          playerId: player.id,
          player: expect.objectContaining({
            id: player.id,
            name: player.name,
            email: player.email,
            unitId: player.unitId
          }),
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      ])
    })

    it('should return match participants when user is manager', async () => {
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
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
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

      const sport = await Sport.create({
        name: 'Test Sport',
        description: 'Test Description'
      })

      const team = await Team.create({
        name: 'Test Team',
        description: 'Test Description',
        unitId: unit.id,
        sportId: sport.id
      })

      const matchParticipant = await MatchParticipant.create({
        matchId: match.id,
        participantType: 'team',
        teamId: team.id
      })

      const response = await request(app)
        .get(`/api/matches/${match.id}/participants`)
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        expect.objectContaining({
          id: matchParticipant.id,
          matchId: match.id,
          participantType: 'team',
          teamId: team.id,
          playerId: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      ])
    })

    it('should return 404 when match is not found', async () => {
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
        .get('/api/matches/999999/participants')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Partida não encontrada')
    })

    it('should return 403 when no token is provided', async () => {
      const response = await request(app).get('/api/matches/1/participants')

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('DELETE /api/matches/:matchId/participants/:participantId', () => {
    it('should delete match participant when user is admin', async () => {
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
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
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

      const sport = await Sport.create({
        name: 'Test Sport',
        description: 'Test Description'
      })

      const team = await Team.create({
        name: 'Test Team',
        description: 'Test Description',
        unitId: unit.id,
        sportId: sport.id
      })

      const matchParticipant = await MatchParticipant.create({
        matchId: match.id,
        participantType: 'team',
        teamId: team.id
      })

      const response = await request(app)
        .delete(`/api/matches/${match.id}/participants/${matchParticipant.id}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(204)

      const deleted = await MatchParticipant.findByPk(matchParticipant.id)
      expect(deleted).toBeNull()
    })

    it('should return 404 when match participant is not found', async () => {
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
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
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
        .delete(`/api/matches/${match.id}/participants/999999`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Participante não encontrado')
    })

    it('should return 403 when user is manager', async () => {
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
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
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

      const sport = await Sport.create({
        name: 'Test Sport',
        description: 'Test Description'
      })

      const team = await Team.create({
        name: 'Test Team',
        description: 'Test Description',
        unitId: unit.id,
        sportId: sport.id
      })

      const matchParticipant = await MatchParticipant.create({
        matchId: match.id,
        participantType: 'team',
        teamId: team.id
      })

      const response = await request(app)
        .delete(`/api/matches/${match.id}/participants/${matchParticipant.id}`)
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })

    it('should return 403 when no token is provided', async () => {
      const response = await request(app).delete('/api/matches/1/participants/1')

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })
})
