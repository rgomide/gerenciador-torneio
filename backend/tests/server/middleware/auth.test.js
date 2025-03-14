const jwt = require('jsonwebtoken')
const authMiddleware = require('@server/middleware/auth')
const { User } = require('@server/models')
const { JWT } = require('@server/config/constants')

describe('Auth Middleware', () => {
  it('add user object to request when token is valid', async () => {
    const user = await User.create({
      firstName: 'Denecley',
      lastName: 'Alvim',
      userName: 'admin',
      email: 'denecley@gmail.com',
      password: '111'
    })

    const token = jwt.sign({ id: user.id }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN })

    const req = {
      headers: {
        authorization: `Bearer ${token}`
      }
    }
    const res = {}
    const next = jest.fn()
    await authMiddleware(req, res, next)

    expect(req.user).toMatchObject({
      userName: 'admin',
      email: 'denecley@gmail.com',
      firstName: 'Denecley',
      id: expect.any(String),
      lastName: 'Alvim',
      password: '111',
      roles: [],
      createdAt: expect.any(Object),
      updatedAt: expect.any(Object)
    })
  })

  it('bypass when jwt token is not valid', async () => {
    const req = {
      headers: {
        authorization: `Bearer 123`
      }
    }
    const res = {}
    const next = jest.fn()

    await authMiddleware(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(req.user).toBeUndefined()
  })

  it('bypass when jwt token is not provided', async () => {
    const req = {
      headers: {}
    }
    const res = {}
    const next = jest.fn()

    await authMiddleware(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(req.user).toBeUndefined()
  })
})
