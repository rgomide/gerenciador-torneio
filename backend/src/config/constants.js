module.exports = {
  JWT: {
    SECRET: process.env.JWT_SECRET,
    EXPIRES_IN: '1y'
  },
  ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    GUEST: 'guest'
  }
}
