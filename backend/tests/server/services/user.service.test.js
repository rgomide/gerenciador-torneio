const { User } = require('@server/models')
const { findAll, findById, create } = require('@server/services/user.service')

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

  describe('create', () => {
    it('should create a user', async () => {
      const user = await create({
        userName: 'admin',
        firstName: 'Denecley',
        lastName: 'Alvim',
        email: 'denecley@gmail.com',
        password: '111'
      })

      expect(user).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          userName: 'admin',
          firstName: 'Denecley',
          lastName: 'Alvim',
          email: 'denecley@gmail.com',
          password: '111'
        })
      )
    })

    it('should throw an error ir user already exists', async () => {
      await User.create({
        userName: 'admin',
        firstName: 'Denecley',
        lastName: 'Alvim',
        email: 'denecley@gmail.com',
        password: '111'
      })

      await expect(
        create({
          userName: 'admin',
          firstName: 'Denecley',
          lastName: 'Alvim',
          email: 'denecley@gmail.com',
          password: '111'
        })
      ).rejects.toThrow('Usuário já existe')
    })

    it('should throw an error if user is not valid', async () => {
      await expect(
        create({
          userName: 'admin',
          firstName: 'Denecley',
          lastName: 'Alvim',
          email: 'denecley@gmail.com',
          password: ''
        })
      ).rejects.toThrow('Senha é obrigatória')
    })

    it('should throw an error if email is not valid', async () => {
      await expect(
        create({
          userName: 'admin',
          firstName: 'Denecley',
          lastName: 'Alvim',
          email: 'aaaaa',
          password: '111'
        })
      ).rejects.toThrow('Formato de email inválido')
    })

    it('should throw an error if user name is not valid', async () => {
      await expect(
        create({
          userName: '',
          firstName: 'Denecley',
          lastName: 'Alvim',
          email: 'denecley@gmail.com',
          password: '111'
        })
      ).rejects.toThrow('Nome de usuário é obrigatório')
    })
  })
})
