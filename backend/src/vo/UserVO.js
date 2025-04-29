class UserVO {
  constructor(user) {
    this.userModel = user
  }

  toJSON() {
    const {
      id,
      email,
      userName,
      firstName,
      lastName,
      createdAt,
      updatedAt,
      isAdmin,
      isManager,
      roles = []
    } = this.userModel

    const rolesVO = roles.map((role) => role.name)

    return {
      id,
      email,
      userName,
      firstName,
      lastName,
      isAdmin,
      isManager,
      roles: rolesVO,
      createdAt,
      updatedAt
    }
  }

  static parseCollection(users) {
    return users.map((user) => new UserVO(user).toJSON())
  }
}

module.exports = UserVO
