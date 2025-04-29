const request = require('supertest')
const { User, Role, RequestLog } = require('@server/models')
const app = require('@server/app')
const jwt = require('jsonwebtoken')
const { JWT, ROLES } = require('@server/config/constants')

describe('API Logger Middleware', () => {
  test('should log the request and response', async () => {
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

    const requestLogs = await RequestLog.findAll({})

    expect(requestLogs[0].toJSON()).toEqual(
      expect.objectContaining({
        ip: expect.any(String),
        userId: adminUser.id,
        userName: 'admin',
        method: 'POST',
        url: '/api/institutions',
        payload: { name: 'New Institution' },
        response: {
          id: expect.any(String),
          name: 'New Institution',
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        },
        status: 201,
        responseTime: expect.any(Number),
        createdAt: expect.any(Date)
      })
    )
  })
})
