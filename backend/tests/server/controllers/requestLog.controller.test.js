const request = require('supertest')
const app = require('@server/app')
const jwt = require('jsonwebtoken')
const { JWT, ROLES } = require('@server/config/constants')
const { User, Role, RequestLog } = require('@server/models')

describe('RequestLogController', () => {
  describe('GET /api/request-logs', () => {
    it('should return all request logs', async () => {
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

      const token = jwt.sign({ id: adminUser.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      await RequestLog.create({
        ip: '127.0.0.1',
        userId: adminUser.id,
        userName: adminUser.userName,
        method: 'GET',
        url: '/api/request-logs',
        payload: {},
        response: {},
        responseTime: 100,
        status: 200
      })

      const response = await request(app)
        .get('/api/request-logs')
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)

      expect(response.body).toEqual([
        {
          id: expect.any(String),
          ip: '127.0.0.1',
          userName: 'admin',
          method: 'GET',
          url: '/api/request-logs',
          responseTime: 100,
          status: 200,
          createdAt: expect.any(String)
        }
      ])
    })
  })
})
