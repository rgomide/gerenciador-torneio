const authorizationMiddleware = require('@server/middleware/authorization')
const {
  ROLES: { ADMIN, PLAYER }
} = require('@server/config/constants')

describe('Authorization Middleware', () => {
  it('should validate a user with the required roles', () => {
    const req = { user: { roles: [{ name: ADMIN }] } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    const next = jest.fn()

    authorizationMiddleware([ADMIN])(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  it('should return 403 if user is not authorized', () => {
    const req = { user: { roles: [{ name: PLAYER }] } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    const next = jest.fn()

    authorizationMiddleware([ADMIN])(req, res, next)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' })
  })

  it('should bypass when no required roles are provided', () => {
    const req = { user: { roles: [] } }
    const res = {}
    const next = jest.fn()

    authorizationMiddleware()(req, res, next)

    expect(next).toHaveBeenCalled()
  })
})
