const request = require('supertest')
const app = require('@server/app')
const { User } = require('@server/models')

describe('Auth Controller', () => {
  describe('POST /api/auth/login', () => {
    it('should login a user', async () => {
      await User.create({
        firstName: 'Denecley',
        lastName: 'Alvim',
        userName: 'admin',
        email: 'denecley@gmail.com',
        password: '111'
      })

      const response = await request(app).post('/api/auth/login').send({
        userName: 'admin',
        password: '111'
      })

      expect(response.status).toBe(200)

      expect(response.body).toEqual({
        user: expect.objectContaining({
          id: expect.any(String),
          email: 'denecley@gmail.com',
          userName: 'admin',
          firstName: 'Denecley',
          lastName: 'Alvim'
        }),
        token: expect.any(String)
      })
    })

    it('returns a 400 when the userName is not provided', async () => {
      const response = await request(app).post('/api/auth/login').send({
        password: '111'
      })

      expect(response.status).toBe(400)
    })

    it('retuns a 404 when the user is not found', async () => {
      const response = await request(app).post('/api/auth/login').send({
        userName: 'admin',
        password: '111'
      })

      expect(response.status).toBe(404)
    })

    it('retuns a 401 when the password is incorrect', async () => {
      await User.create({
        firstName: 'Denecley',
        lastName: 'Alvim',
        userName: 'admin',
        email: 'denecley@gmail.com',
        password: '111'
      })

      const response = await request(app).post('/api/auth/login').send({
        userName: 'admin',
        password: '112'
      })

      expect(response.status).toBe(401)
    })
  })
})
