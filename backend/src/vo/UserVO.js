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
      roles = []
    } = this.userModel

    const rolesVO = roles.map((role) => role.name)

    return {
      id,
      email,
      userName,
      firstName,
      lastName,
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
