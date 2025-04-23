const SportVO = require('./SportVO')

class TeamVO {
  constructor(team) {
    this.team = team
  }

  toJSON() {
    const { id, name, unitId, sportId, sport, createdAt, updatedAt } = this.team

    const sportVO = sport ? new SportVO(sport).toJSON() : null

    return {
      id,
      name,
      unitId,
      sportId,
      sport: sportVO,
      createdAt,
      updatedAt
    }
  }

  static parseCollection(teams) {
    return teams.map((team) => new TeamVO(team).toJSON())
  }
}

module.exports = TeamVO
