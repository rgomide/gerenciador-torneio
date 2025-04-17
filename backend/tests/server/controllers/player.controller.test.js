const request = require('supertest')
const { User, Role, Unit, Player, Institution } = require('@server/models')
const app = require('@server/app')
const jwt = require('jsonwebtoken')
const { JWT, ROLES } = require('@server/config/constants')

describe('GET /api/units/:unitId/players', () => {
  it('should return players for a unit when authenticated as admin', async () => {
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
    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const player = await Player.create({
      name: 'Test Player',
      email: 'test@example.com',
      phone: '1234567890',
      unitId: unit.id
    })

    const response = await request(app)
      .get(`/api/units/${unit.id}/players`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual([
      {
        id: player.id,
        name: player.name,
        email: player.email,
        phone: player.phone,
        unitId: unit.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }
    ])
  })

  it('should return players for a unit when authenticated as manager', async () => {
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
    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const player = await Player.create({
      name: 'Test Player',
      email: 'test@example.com',
      phone: '1234567890',
      unitId: unit.id
    })

    const response = await request(app)
      .get(`/api/units/${unit.id}/players`)
      .set('Authorization', `Bearer ${managerToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual([
      {
        id: player.id,
        name: player.name,
        email: player.email,
        phone: player.phone,
        unitId: unit.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }
    ])
  })

  it('should return 403 when not authenticated', async () => {
    const institution = await Institution.create({ name: 'Test Institution' })
    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const response = await request(app).get(`/api/units/${unit.id}/players`)

    expect(response.status).toBe(403)
  })

  it('should return 404 when unit not found', async () => {
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
      .get('/api/units/666/players')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Unidade não encontrada')
  })
})

describe('GET /api/players', () => {
  it('should return all players when authenticated as admin', async () => {
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
    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const player = await Player.create({
      name: 'Test Player',
      email: 'test@example.com',
      phone: '1234567890',
      unitId: unit.id
    })

    const response = await request(app)
      .get('/api/players')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual([
      {
        id: player.id,
        name: player.name,
        email: player.email,
        phone: player.phone,
        unitId: unit.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }
    ])
  })

  it('should return all players when authenticated as manager', async () => {
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
    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const player = await Player.create({
      name: 'Test Player',
      email: 'test@example.com',
      phone: '1234567890',
      unitId: unit.id
    })

    const response = await request(app)
      .get('/api/players')
      .set('Authorization', `Bearer ${managerToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual([
      {
        id: player.id,
        name: player.name,
        email: player.email,
        phone: player.phone,
        unitId: unit.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }
    ])
  })

  it('should return 403 when not authenticated', async () => {
    const response = await request(app).get('/api/players')

    expect(response.status).toBe(403)
  })
})

describe('GET /api/players/:playerId', () => {
  it('should return a player when authenticated as admin', async () => {
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
    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const player = await Player.create({
      name: 'Test Player',
      email: 'test@example.com',
      phone: '1234567890',
      unitId: unit.id
    })

    const response = await request(app)
      .get(`/api/players/${player.id}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      id: player.id,
      name: player.name,
      email: player.email,
      phone: player.phone,
      unitId: unit.id,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    })
  })

  it('should return 404 when player not found', async () => {
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
      .get('/api/players/666')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Jogador não encontrado')
  })
})

describe('POST /api/players', () => {
  it('should create a new player when authenticated as admin', async () => {
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
    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const newPlayer = {
      name: 'New Player',
      email: 'new@example.com',
      phone: '9876543210',
      unitId: unit.id
    }

    const response = await request(app)
      .post('/api/players')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newPlayer)

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      id: expect.any(String),
      name: newPlayer.name,
      email: newPlayer.email,
      phone: newPlayer.phone,
      unitId: unit.id,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    })
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
      .post('/api/players')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({})

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Nome é obrigatório')
  })
})

describe('PUT /api/players/:playerId', () => {
  it('should update a player when authenticated as admin', async () => {
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
    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const player = await Player.create({
      name: 'Test Player',
      email: 'test@example.com',
      phone: '1234567890',
      unitId: unit.id
    })

    const updatedData = {
      name: 'Updated Player',
      email: 'updated@example.com',
      phone: '5555555555',
      unitId: unit.id
    }

    const response = await request(app)
      .put(`/api/players/${player.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updatedData)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      id: player.id,
      name: updatedData.name,
      email: updatedData.email,
      phone: updatedData.phone,
      unitId: unit.id,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    })
  })

  it('should return 404 when player not found', async () => {
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
    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const response = await request(app)
      .put('/api/players/6666')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Updated Player',
        email: 'updated@example.com',
        phone: '5555555555',
        unitId: unit.id
      })

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Jogador não encontrado')
  })
})

describe('DELETE /api/players/:playerId', () => {
  it('should delete a player when authenticated as admin', async () => {
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
    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const player = await Player.create({
      name: 'Test Player',
      email: 'test@example.com',
      phone: '1234567890',
      unitId: unit.id
    })

    const response = await request(app)
      .delete(`/api/players/${player.id}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(204)
  })

  it('should return 404 when player not found', async () => {
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
      .delete('/api/players/6666')
      .set('Authorization', `Bearer ${adminToken}`)

    console.log(response.body)

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Jogador não encontrado')
  })
})
