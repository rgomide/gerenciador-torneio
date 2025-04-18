const request = require('supertest')
const { User, Role, Institution, Unit, Sport, Team, Player, TeamPlayer } = require('@server/models')
const app = require('@server/app')
const jwt = require('jsonwebtoken')
const { JWT, ROLES } = require('@server/config/constants')

describe('Team Controller', () => {
  describe('GET /api/teams', () => {
    it('should return all teams when user is admin', async () => {
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
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })

      const response = await request(app)
        .get('/api/teams')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          name: 'Team 1',
          unitId: unit.id,
          sportId: sport.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      ])
    })

    it('should return all teams when user is manager', async () => {
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
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })

      const response = await request(app)
        .get('/api/teams')
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(200)
    })

    it('should return 403 when no token is provided', async () => {
      const response = await request(app).get('/api/teams')

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('GET /api/teams/:teamId', () => {
    it('should return team by id when user is admin', async () => {
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
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })

      const response = await request(app)
        .get(`/api/teams/${team.id}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        id: team.id,
        name: 'Team 1',
        unitId: unit.id,
        sportId: sport.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })

    it('should return team by id when user is manager', async () => {
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
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })

      const response = await request(app)
        .get(`/api/teams/${team.id}`)
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(200)
    })

    it('should return 404 when team is not found', async () => {
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
        .get('/api/teams/999999')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Time não encontrado')
    })

    it('should return 403 when no token is provided', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })

      const response = await request(app).get(`/api/teams/${team.id}`)

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('GET /api/units/:unitId/teams', () => {
    it('should return teams for a unit when user is admin', async () => {
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
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })

      const response = await request(app)
        .get(`/api/units/${unit.id}/teams`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          name: 'Team 1',
          unitId: unit.id,
          sportId: sport.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      ])
    })

    it('should return teams for a unit when user is manager', async () => {
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
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })

      const response = await request(app)
        .get(`/api/units/${unit.id}/teams`)
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(200)
    })

    it('should return 404 when unit is not found', async () => {
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
        .get('/api/units/999999/teams')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Unidade não encontrada')
    })

    it('should return 403 when no token is provided', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })

      const response = await request(app).get(`/api/units/${unit.id}/teams`)

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('GET /api/sports/:sportId/teams', () => {
    it('should return teams for a sport when user is admin', async () => {
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
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })

      const response = await request(app)
        .get(`/api/sports/${sport.id}/teams`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          name: 'Team 1',
          unitId: unit.id,
          sportId: sport.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      ])
    })

    it('should return teams for a sport when user is manager', async () => {
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
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })

      const response = await request(app)
        .get(`/api/sports/${sport.id}/teams`)
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(200)
    })

    it('should return 404 when sport is not found', async () => {
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
        .get('/api/sports/999999/teams')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Esporte não encontrado')
    })

    it('should return 403 when no token is provided', async () => {
      const sport = await Sport.create({ name: 'Futebol' })

      const response = await request(app).get(`/api/sports/${sport.id}/teams`)

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('GET /api/teams/:teamId/players', () => {
    it('should return players in a team when user is admin', async () => {
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
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })
      const player1 = await Player.create({
        name: 'Player 1',
        email: 'player1@test.com',
        unitId: unit.id
      })
      const player2 = await Player.create({
        name: 'Player 2',
        email: 'player2@test.com',
        unitId: unit.id
      })

      await TeamPlayer.create({ teamId: team.id, playerId: player1.id })
      await TeamPlayer.create({ teamId: team.id, playerId: player2.id })

      const response = await request(app)
        .get(`/api/teams/${team.id}/players`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        expect.objectContaining({
          id: player1.id,
          name: player1.name,
          email: player1.email,
          unitId: unit.id
        }),
        expect.objectContaining({
          id: player2.id,
          name: player2.name,
          email: player2.email,
          unitId: unit.id
        })
      ])
    })

    it('should return players in a team when user is manager', async () => {
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
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })
      const player1 = await Player.create({
        name: 'Player 1',
        email: 'player1@test.com',
        unitId: unit.id
      })
      const player2 = await Player.create({
        name: 'Player 2',
        email: 'player2@test.com',
        unitId: unit.id
      })

      await TeamPlayer.create({ teamId: team.id, playerId: player1.id })
      await TeamPlayer.create({ teamId: team.id, playerId: player2.id })

      const response = await request(app)
        .get(`/api/teams/${team.id}/players`)
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(2)
    })

    it('should return 404 when team is not found', async () => {
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
        .get('/api/teams/999999/players')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Time não encontrado')
    })

    it('should return 403 when no token is provided', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })

      const response = await request(app).get(`/api/teams/${team.id}/players`)

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('POST /api/teams', () => {
    it('should create a team when user is admin', async () => {
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
      const sport = await Sport.create({ name: 'Futebol' })

      const response = await request(app)
        .post('/api/teams')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'New Team', unitId: unit.id, sportId: sport.id })

      expect(response.status).toBe(201)
      expect(response.body).toEqual({
        id: expect.any(String),
        name: 'New Team',
        unitId: unit.id,
        sportId: sport.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })
  })

  describe('PUT /api/teams/:teamId', () => {
    it('should update a team when user is admin', async () => {
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
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })

      const response = await request(app)
        .put(`/api/teams/${team.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Team', unitId: unit.id, sportId: sport.id })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        id: team.id,
        name: 'Updated Team',
        unitId: unit.id,
        sportId: sport.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })

    it('should return 404 when team is not found', async () => {
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
        .put('/api/teams/999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Team' })

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Time não encontrado')
    })
  })

  describe('DELETE /api/teams/:teamId', () => {
    it('should delete a team when user is admin', async () => {
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
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })

      const response = await request(app)
        .delete(`/api/teams/${team.id}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(204)
    })

    it('should return 404 when team is not found', async () => {
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
        .delete('/api/teams/999999')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Time não encontrado')
    })
  })

  describe('POST /api/teams/:teamId/players/:playerId', () => {
    it('should add a player to a team when user is admin', async () => {
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
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })
      const player = await Player.create({
        name: 'Player 1',
        email: 'player1@test.com',
        unitId: unit.id
      })

      const response = await request(app)
        .post(`/api/teams/${team.id}/players/${player.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ details: 'this is my details' })

      expect(response.status).toBe(201)
      expect(response.body).toEqual(
        expect.objectContaining({
          teamId: team.id,
          playerId: player.id,
          details: 'this is my details'
        })
      )
    })

    it('should add a player to a team when user is manager', async () => {
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
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })
      const player = await Player.create({
        name: 'Player 1',
        email: 'player1@test.com',
        unitId: unit.id
      })

      const response = await request(app)
        .post(`/api/teams/${team.id}/players/${player.id}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ details: 'this is my detail' })

      expect(response.status).toBe(201)
    })

    it('should return 404 when team is not found', async () => {
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
      const player = await Player.create({
        name: 'Player 1',
        email: 'player1@test.com',
        unitId: unit.id
      })

      const response = await request(app)
        .post(`/api/teams/999999/players/${player.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ details: 'this is my detail' })

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Time não encontrado')
    })

    it('should return 404 when player is not found', async () => {
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
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })

      const response = await request(app)
        .post(`/api/teams/${team.id}/players/999999`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ details: { number: 10, position: 'Atacante' } })

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Jogador não encontrado')
    })

    it('should return 400 when player is already in team', async () => {
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
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })
      const player = await Player.create({
        name: 'Player 1',
        email: 'player1@test.com',
        unitId: unit.id
      })

      await TeamPlayer.create({
        teamId: team.id,
        playerId: player.id,
        details: 'this is my details'
      })

      const response = await request(app)
        .post(`/api/teams/${team.id}/players/${player.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ details: 'this is my details' })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Jogador já está no time')
    })

    it('should return 403 when no token is provided', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })
      const player = await Player.create({
        name: 'Player 1',
        email: 'player1@test.com',
        unitId: unit.id
      })

      const response = await request(app)
        .post(`/api/teams/${team.id}/players/${player.id}`)
        .send({ details: { number: 10, position: 'Atacante' } })

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('DELETE /api/teams/:teamId/players/:playerId', () => {
    it('should remove a player from a team when user is admin', async () => {
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
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })
      const player = await Player.create({
        name: 'Player 1',
        email: 'player1@test.com',
        unitId: unit.id
      })

      await TeamPlayer.create({
        teamId: team.id,
        playerId: player.id,
        details: 'this is my details'
      })

      const response = await request(app)
        .delete(`/api/teams/${team.id}/players/${player.id}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(204)

      const teamPlayer = await TeamPlayer.findOne({
        where: { teamId: team.id, playerId: player.id }
      })
      expect(teamPlayer).toBeNull()
    })

    it('should remove a player from a team when user is manager', async () => {
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
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })
      const player = await Player.create({
        name: 'Player 1',
        email: 'player1@test.com',
        unitId: unit.id
      })

      await TeamPlayer.create({
        teamId: team.id,
        playerId: player.id,
        details: 'this is my details'
      })

      const response = await request(app)
        .delete(`/api/teams/${team.id}/players/${player.id}`)
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(204)

      const teamPlayer = await TeamPlayer.findOne({
        where: { teamId: team.id, playerId: player.id }
      })
      expect(teamPlayer).toBeNull()
    })

    it('should return 404 when team-player relationship is not found', async () => {
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
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })
      const player = await Player.create({
        name: 'Player 1',
        email: 'player1@test.com',
        unitId: unit.id
      })

      const response = await request(app)
        .delete(`/api/teams/${team.id}/players/${player.id}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Relação time-jogador não encontrada')
    })

    it('should return 403 when no token is provided', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })
      const player = await Player.create({
        name: 'Player 1',
        email: 'player1@test.com',
        unitId: unit.id
      })

      const response = await request(app)
        .delete(`/api/teams/${team.id}/players/${player.id}`)

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })
})
