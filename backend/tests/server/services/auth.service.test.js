const { login } = require('@server/services/auth.service')
const { User } = require('@server/models')

describe('Auth Service', () => {
  describe('login', () => {
    it('should login a user', async () => {
      const user = await User.create({
        firstName: 'Denecley',
        lastName: 'Alvim',
        userName: 'admin',
        email: 'denecley@gmail.com',
        password: '111'
      })

      const result = await login(user.userName, user.password)

      expect(result).toEqual({
        token: expect.any(String),
        user: expect.objectContaining({
          id: expect.any(String),
          userName: 'admin',
          email: 'denecley@gmail.com',
          firstName: 'Denecley',
          lastName: 'Alvim'
        })
      })
    })

    it('should throw an error if user is not found', async () => {
      await expect(login('admin', '111')).rejects.toThrow('User not found')
    })

    it('should throw an error if password is incorrect', async () => {
      const user = await User.create({
        firstName: 'Denecley',
        lastName: 'Alvim',
        userName: 'admin',
        email: 'denecley@gmail.com',
        password: '111'
      })

      await expect(login(user.userName, '123')).rejects.toThrow('Invalid password')
    })

    it('should throw an error if user name and password are not provided', async () => {
      await expect(login('', '')).rejects.toThrow('User name and password are required')
    })
  })
})
