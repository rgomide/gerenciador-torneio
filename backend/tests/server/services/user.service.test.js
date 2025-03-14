const { User } = require('@server/models')
const { findAll, findById } = require('@server/services/user.service')

describe('User Service', () => {
  describe('findAll', () => {
    it('should find all users', async () => {
      await User.create({
        firstName: 'Denecley',
        lastName: 'Alvim',
        userName: 'admin',
        email: 'denecley@gmail.com',
        password: '111'
      })

      const users = await findAll()

      expect(users).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          firstName: 'Denecley',
          lastName: 'Alvim',
          userName: 'admin',
          email: 'denecley@gmail.com'
        })
      ])
    })
  })

  describe('findById', () => {
    it('should find a user by id', async () => {
      const user = await User.create({
        firstName: 'Denecley',
        lastName: 'Alvim',
        userName: 'admin',
        email: 'denecley@gmail.com',
        password: '111'
      })

      const foundUser = await findById(user.id)

      expect(foundUser).toEqual(
        expect.objectContaining({
          id: user.id,
          firstName: 'Denecley',
          lastName: 'Alvim',
          userName: 'admin',
          email: 'denecley@gmail.com'
        })
      )
    })

    it('should throw an error if user is not found', async () => {
      await expect(findById('123')).rejects.toThrow('User not found')
    })
  })
})
