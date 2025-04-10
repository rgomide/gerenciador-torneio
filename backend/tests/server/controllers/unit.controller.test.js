const request = require('supertest')
const { User, Role, Institution, Unit } = require('@server/models')
const app = require('@server/app')
const jwt = require('jsonwebtoken')
const { JWT, ROLES } = require('@server/config/constants')

describe('Unit Controller', () => {
  describe('GET /api/units', () => {
    it('should return all units when user is admin', async () => {
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
      await Unit.create({ name: 'Unit 1', institutionId: institution.id })
      await Unit.create({ name: 'Unit 2', institutionId: institution.id })

      const response = await request(app)
        .get('/api/units')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          name: 'Unit 1',
          institutionId: institution.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }),
        expect.objectContaining({
          id: expect.any(String),
          name: 'Unit 2',
          institutionId: institution.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      ])
    })

    it('should return all units when user is manager', async () => {
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
      await Unit.create({ name: 'Unit 1', institutionId: institution.id })

      const response = await request(app)
        .get('/api/units')
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(200)
    })

    it('should return 403 when no token is provided', async () => {
      const response = await request(app).get('/api/units')

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Forbidden')
    })
  })

  describe('GET /api/institutions/:institutionId/units', () => {
    it('should return all units of an institution when user is admin', async () => {
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
      await Unit.create({ name: 'Unit 1', institutionId: institution.id })
      await Unit.create({ name: 'Unit 2', institutionId: institution.id })

      const response = await request(app)
        .get(`/api/institutions/${institution.id}/units`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          name: 'Unit 1',
          institutionId: institution.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }),
        expect.objectContaining({
          id: expect.any(String),
          name: 'Unit 2',
          institutionId: institution.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      ])
    })

    it('should return all units of an institution when user is manager', async () => {
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
      await Unit.create({ name: 'Unit 1', institutionId: institution.id })

      const response = await request(app)
        .get(`/api/institutions/${institution.id}/units`)
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
        .get('/api/institutions/999999/units')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Instituição não encontrada')
    })

    it('should return 403 when no token is provided', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })

      const response = await request(app).get(`/api/institutions/${institution.id}/units`)

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Forbidden')
    })
  })

  describe('GET /api/units/:unitId', () => {
    it('should return unit by id when user is admin', async () => {
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

      const response = await request(app)
        .get(`/api/units/${unit.id}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        id: unit.id,
        name: 'Test Unit',
        institutionId: institution.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })

    it('should return unit by id when user is manager', async () => {
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

      const response = await request(app)
        .get(`/api/units/${unit.id}`)
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
        .get('/api/units/999999')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Unidade não encontrada')
    })

    it('should return 403 when no token is provided', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })

      const response = await request(app).get(`/api/units/${unit.id}`)

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Forbidden')
    })
  })

  describe('POST /api/units', () => {
    it('should create a new unit when user is admin', async () => {
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
        .post('/api/units')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'New Unit', institutionId: institution.id })

      expect(response.status).toBe(201)
      expect(response.body).toEqual({
        id: expect.any(String),
        name: 'New Unit',
        institutionId: institution.id,
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
        .post('/api/units')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ name: 'New Unit', institutionId: institution.id })

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Forbidden')
    })

    it('should return 403 when no token is provided', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })

      const response = await request(app)
        .post('/api/units')
        .send({ name: 'New Unit', institutionId: institution.id })

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Forbidden')
    })

    it('should return 404 when institution does not exist', async () => {
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
        .post('/api/units')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'New Unit', institutionId: '999999' })

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Instituição não encontrada')
    })
  })

  describe('PUT /api/units/:unitId', () => {
    it('should update unit when user is admin', async () => {
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

      const response = await request(app)
        .put(`/api/units/${unit.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Unit', institutionId: institution.id })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        id: unit.id,
        name: 'Updated Unit',
        institutionId: institution.id,
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
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })

      const response = await request(app)
        .put(`/api/units/${unit.id}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ name: 'Updated Unit', institutionId: institution.id })

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Forbidden')
    })

    it('should return 403 when no token is provided', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })

      const response = await request(app)
        .put(`/api/units/${unit.id}`)
        .send({ name: 'Updated Unit', institutionId: institution.id })

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Forbidden')
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

      const institution = await Institution.create({ name: 'Test Institution' })

      const response = await request(app)
        .put('/api/units/999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Unit', institutionId: institution.id })

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Unidade não encontrada')
    })

    it('should return 404 when new institution does not exist', async () => {
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

      const response = await request(app)
        .put(`/api/units/${unit.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Unit', institutionId: '999999' })

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Instituição não encontrada')
    })
  })
})
