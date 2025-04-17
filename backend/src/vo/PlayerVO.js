class PlayerVO {
  constructor(player) {
    this.player = player
  }

  toJSON() {
    const { id, name, email, phone, unitId, createdAt, updatedAt } = this.player

    return {
      id,
      name,
      email,
      phone,
      unitId,
      createdAt,
      updatedAt
    }
  }

  static parseCollection(players) {
    return players.map((player) => new PlayerVO(player).toJSON())
  }
}

module.exports = PlayerVO
