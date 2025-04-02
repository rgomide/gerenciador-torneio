const request = require('supertest')
const { User, Role, Institution } = require('@server/models')
const app = require('@server/app')
const jwt = require('jsonwebtoken')
const { JWT, ROLES } = require('@server/config/constants')

describe('Institution Controller', () => {
  describe('POST /api/institutions', () => {
    it('should create a new institution when user is admin', async () => {
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
        .post('/api/institutions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'New Institution' })

      expect(response.status).toBe(201)
      expect(response.body).toEqual({
        id: expect.any(String),
        name: 'New Institution',
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })

    it('should return 403 when user is not admin', async () => {
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
        .post('/api/institutions')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ name: 'New Institution' })

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Forbidden')
    })

    it('should return 403 when no token is provided', async () => {
      const response = await request(app)
        .post('/api/institutions')
        .send({ name: 'New Institution' })

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Forbidden')
    })
  })

  describe('GET /api/institutions', () => {
    it('should return all institutions when user is admin', async () => {
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

      await Institution.create({ name: 'Institution 1' })
      await Institution.create({ name: 'Institution 2' })

      const response = await request(app)
        .get('/api/institutions')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          name: 'Institution 1',
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }),
        expect.objectContaining({
          id: expect.any(String),
          name: 'Institution 2',
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      ])
    })

    it('should return all institutions when user is manager', async () => {
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
        .get('/api/institutions')
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(200)
    })

    it('should return 403 when no token is provided', async () => {
      const response = await request(app).get('/api/institutions')

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Forbidden')
    })
  })

  describe('GET /api/institutions/:institutionId', () => {
    it('should return institution by id when user is admin', async () => {
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

      const response = await request(app)
        .get(`/api/institutions/${institution.id}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        id: institution.id,
        name: 'Test Institution',
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })

    it('should return institution by id when user is manager', async () => {
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

      const response = await request(app)
        .get(`/api/institutions/${institution.id}`)
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(200)
    })

    it('should return 404 when institution is not found', async () => {
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
        .get('/api/institutions/999999')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Institution not found')
    })

    it('should return 403 when no token is provided', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })

      const response = await request(app).get(`/api/institutions/${institution.id}`)

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Forbidden')
    })
  })

  describe('PUT /api/institutions/:institutionId', () => {
    it('should update institution when user is admin', async () => {
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

      const response = await request(app)
        .put(`/api/institutions/${institution.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Institution' })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        id: institution.id,
        name: 'Updated Institution',
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })

    it('should return 403 when user is not admin', async () => {
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

      const response = await request(app)
        .put(`/api/institutions/${institution.id}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ name: 'Updated Institution' })

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Forbidden')
    })

    it('should return 404 when institution is not found', async () => {
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
        .put('/api/institutions/999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Institution' })

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Institution not found')
    })

    it('should return 403 when no token is provided', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })

      const response = await request(app)
        .put(`/api/institutions/${institution.id}`)
        .send({ name: 'Updated Institution' })

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Forbidden')
    })
  })
})
