const request = require('supertest')
const { User, Role, Sport } = require('@server/models')
const app = require('@server/app')
const jwt = require('jsonwebtoken')
const { JWT, ROLES } = require('@server/config/constants')

describe('Sport Controller', () => {
  describe('GET /api/sports', () => {
    it('should return all sports when user is admin', async () => {
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

      await Sport.create({ name: 'Futebol' })

      const response = await request(app)
        .get('/api/sports')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          name: 'Futebol',
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      ])
    })

    it('should return all sports when user is manager', async () => {
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

      await Sport.create({ name: 'Futebol' })

      const response = await request(app)
        .get('/api/sports')
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(200)
    })

    it('should return 403 when no token is provided', async () => {
      const response = await request(app).get('/api/sports')

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('GET /api/sports/:sportId', () => {
    it('should return sport by id when user is admin', async () => {
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

      const sport = await Sport.create({ name: 'Futebol' })

      const response = await request(app)
        .get(`/api/sports/${sport.id}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        id: sport.id,
        name: 'Futebol',
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })

    it('should return sport by id when user is manager', async () => {
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

      const sport = await Sport.create({ name: 'Futebol' })

      const response = await request(app)
        .get(`/api/sports/${sport.id}`)
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
        .get('/api/sports/999999')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Esporte não encontrado')
    })

    it('should return 403 when no token is provided', async () => {
      const sport = await Sport.create({ name: 'Futebol' })

      const response = await request(app).get(`/api/sports/${sport.id}`)

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('POST /api/sports', () => {
    it('should create a sport when user is admin', async () => {
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
        .post('/api/sports')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Futebol' })

      expect(response.status).toBe(201)
      expect(response.body).toEqual({
        id: expect.any(String),
        name: 'Futebol',
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
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

      const response = await request(app)
        .post('/api/sports')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ name: 'Futebol' })

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })

    it('should return 400 when name is not provided', async () => {
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
        .post('/api/sports')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Nome é obrigatório')
    })
  })

  describe('PUT /api/sports/:sportId', () => {
    it('should update a sport when user is admin', async () => {
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

      const sport = await Sport.create({ name: 'Futebol' })

      const response = await request(app)
        .put(`/api/sports/${sport.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Futebol de Salão' })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        id: sport.id,
        name: 'Futebol de Salão',
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
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

      const sport = await Sport.create({ name: 'Futebol' })

      const response = await request(app)
        .put(`/api/sports/${sport.id}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ name: 'Futebol de Salão' })

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
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
        .put('/api/sports/999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Futebol de Salão' })

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Esporte não encontrado')
    })
  })

  describe('DELETE /api/sports/:sportId', () => {
    it('should delete a sport when user is admin', async () => {
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

      const sport = await Sport.create({ name: 'Futebol' })

      const response = await request(app)
        .delete(`/api/sports/${sport.id}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(204)

      const foundSport = await Sport.findByPk(sport.id)
      expect(foundSport).toBeNull()
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

      const sport = await Sport.create({ name: 'Futebol' })

      const response = await request(app)
        .delete(`/api/sports/${sport.id}`)
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
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
        .delete('/api/sports/999999')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Esporte não encontrado')
    })
  })
})
