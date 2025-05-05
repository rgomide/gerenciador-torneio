const TeamVO = require('./TeamVO')
class PlayerVO {
  constructor(player) {
    this.player = player
  }

  toJSON() {
    const { id, name, email, phone, unitId, createdAt, updatedAt, teams } = this.player

    let teamsVO
    if (teams) {
      teamsVO = TeamVO.parseCollection(teams)
    }

    return {
      id,
      name,
      email,
      phone,
      unitId,
      teams: teamsVO,
      createdAt,
      updatedAt
    }
  }

  static parseCollection(players) {
    return players.map((player) => new PlayerVO(player).toJSON())
  }
}

module.exports = PlayerVO
