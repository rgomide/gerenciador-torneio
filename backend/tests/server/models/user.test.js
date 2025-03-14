const { User, Role, Topic } = require('@server/models')

describe('User Model', () => {
  it('should create a user successfully', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      userName: 'johndoe',
      email: 'john@example.com',
      password: 'password123'
    }

    const user = await User.create(userData)
    expect(user.firstName).toBe(userData.firstName)
    expect(user.email).toBe(userData.email)
  })

  it('should not create a user with duplicate email', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      userName: 'johndoe',
      email: 'john@example.com',
      password: 'password123'
    }

    const user = await User.create(userData)

    expect(user.firstName).toBe(userData.firstName)

    await expect(User.create(userData)).rejects.toThrow()
  })

  it('should get user with roles', async () => {
    // try {

    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      userName: 'johndoe',
      email: 'john@example.com',
      password: 'password123'
    }
    const user = await User.create(userData)
    const role = await Role.create({ name: 'test-role' })

    if (!user || !role) {
      throw new Error('User or Role creation failed')
    }

    await user.addRole(role, { through: { userId: user.id, roleId: role.id } })

    const userWithRoles = await User.findByPk(user.id, {
      include: [
        {
          model: Role,
          as: 'roles'
        }
      ]
    })

    expect(userWithRoles.roles).toHaveLength(1)
    expect(userWithRoles.roles[0].name).toBe('test-role')
  })
})
