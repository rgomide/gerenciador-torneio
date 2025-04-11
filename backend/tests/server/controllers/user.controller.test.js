const request = require('supertest')
const { User, Role } = require('@server/models')
const app = require('@server/app')
const jwt = require('jsonwebtoken')
const { JWT } = require('@server/config/constants')

describe('User Controller', () => {
  describe('GET /api/users', () => {
    it('should return a list of users', async () => {
      const role = await Role.create({ name: 'admin' })

      const users = await Promise.all([
        User.create({
          firstName: 'Denecley',
          lastName: 'Alvim',
          userName: 'admin',
          email: 'denecley@gmail.com',
          password: '111'
        }),
        User.create({
          firstName: 'John',
          lastName: 'Doe',
          userName: 'john',
          email: 'john@gmail.com',
          password: '112'
        })
      ])

      await role.addUser(users[0], { through: { userId: users[0].id, roleId: role.id } })

      const token = jwt.sign({ id: users[0].id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })
      const response = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
    })

    it('return 403 if user is not authorized', async () => {
      const response = await request(app).get('/api/users')
      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })

  describe('GET /api/users/:userId', () => {
    it('should return a user by id', async () => {
      const role = await Role.create({ name: 'admin' })

      const user = await User.create({
        firstName: 'Denecley',
        lastName: 'Alvim',
        userName: 'admin',
        email: 'denecley@gmail.com',
        password: '111'
      })

      await role.addUser(user, { through: { userId: user.id, roleId: role.id } })

      const token = jwt.sign({ id: user.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      const response = await request(app)
        .get(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        id: expect.any(String),
        firstName: 'Denecley',
        lastName: 'Alvim',
        userName: 'admin',
        email: 'denecley@gmail.com',
        roles: ['admin'],
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })

    it('return 404 if user is not found', async () => {
      const role = await Role.create({ name: 'admin' })

      const user = await User.create({
        firstName: 'Denecley',
        lastName: 'Alvim',
        userName: 'admin',
        email: 'denecley@gmail.com',
        password: '111'
      })

      await role.addUser(user, { through: { userId: user.id, roleId: role.id } })

      const token = jwt.sign({ id: user.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

      const response = await request(app)
        .get(`/api/users/${user.id + 555}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('User not found')
    })

    it('return 403 if user is not authorized', async () => {
      const response = await request(app).get('/api/users/1')
      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Acesso negado')
    })
  })
})
