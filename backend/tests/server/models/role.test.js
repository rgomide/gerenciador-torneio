const { Role, User, UserRole } = require('@server/models')

describe('Role Model', () => {
  describe('Create Role', () => {
    it('should create a role successfully', async () => {
      const roleData = {
        name: 'admin'
      }

      const role = await Role.create(roleData)
      expect(role.name).toBe(roleData.name)
    })

    it('should not create a role with duplicate name', async () => {
      const roleData = {
        name: 'admin'
      }

      await Role.create(roleData)
      await expect(Role.create(roleData)).rejects.toThrow()
    })
  })

  describe('Role Associations', () => {
    it('should associate role with users', async () => {
      const role = await Role.create({ name: 'player' })

      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        userName: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      }
      const user = await User.create(userData)

      await role.addUser(user, { through: { userId: user.id, roleId: role.id } })

      const roleWithUsers = await Role.findByPk(role.id, {
        include: [
          {
            model: User,
            as: 'users'
          }
        ]
      })

      expect(roleWithUsers.users).toHaveLength(1)
      expect(roleWithUsers.users[0].email).toBe(userData.email)
    })

    it('should associate role with multiple users', async () => {
      const role = await Role.create({ name: 'player' })

      const users = await Promise.all([
        User.create({
          firstName: 'John',
          lastName: 'Doe',
          userName: 'johndoe',
          email: 'john@example.com',
          password: 'password123'
        }),
        User.create({
          firstName: 'Jane',
          lastName: 'Smith',
          userName: 'janesmith',
          email: 'jane@example.com',
          password: 'password123'
        })
      ])

      await role.addUser(users[0], { through: { userId: users[0].id, roleId: role.id } })
      await role.addUser(users[1], { through: { userId: users[1].id, roleId: role.id } })

      const roleWithUsers = await Role.findByPk(role.id, {
        include: [
          {
            model: User,
            as: 'users'
          }
        ]
      })

      expect(roleWithUsers.users).toHaveLength(2)
      expect(roleWithUsers.users.map((user) => user.email)).toEqual(
        expect.arrayContaining(['john@example.com', 'jane@example.com'])
      )
    })
  })

  describe('Role Queries', () => {
    beforeEach(async () => {
      await Role.bulkCreate([{ name: 'admin' }, { name: 'player' }, { name: 'guest' }])
    })

    it('should find role by name', async () => {
      const role = await Role.findOne({ where: { name: 'admin' } })
      expect(role).not.toBeNull()
      expect(role.name).toBe('admin')
    })

    it('should get all roles', async () => {
      const roles = await Role.findAll()
      expect(roles).toHaveLength(3)
      expect(roles.map((role) => role.name)).toEqual(
        expect.arrayContaining(['admin', 'player', 'guest'])
      )
    })
  })

  describe('Role Updates and Deletions', () => {
    it('should update role name', async () => {
      const role = await Role.create({ name: 'temp' })
      await role.update({ name: 'updated' })

      const updatedRole = await Role.findByPk(role.id)
      expect(updatedRole.name).toBe('updated')
    })

    it('should delete role', async () => {
      const role = await Role.create({ name: 'temp' })
      await role.destroy()

      const deletedRole = await Role.findByPk(role.id)
      expect(deletedRole).toBeNull()
    })

    it('should cascade delete user associations when role is deleted', async () => {
      const role = await Role.create({ name: 'temp' })

      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        userName: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      })

      await role.addUser(user, { through: { userId: user.id, roleId: role.id } })
      await role.destroy()

      const usersRoles = await UserRole.findAll({
        where: { roleId: role.id }
      })

      expect(usersRoles).toHaveLength(0)
    })
  })

  describe('Role Validations', () => {
    it('should not create role without name', async () => {
      await expect(Role.create({})).rejects.toThrow()
    })

    it('should not create role with empty name', async () => {
      await expect(Role.create({ name: '' })).rejects.toThrow()
    })

    it('should trim role name', async () => {
      const role = await Role.create({ name: '  admin  ' })
      expect(role.name).toBe('admin')
    })
  })
})
