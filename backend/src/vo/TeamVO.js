const SportVO = require('./SportVO')

class TeamVO {
  constructor(team) {
    this.team = team
  }

  toJSON() {
    const { id, name, unitId, sportId, sport, teamPlayer, createdAt, updatedAt } = this.team

    const sportVO = sport ? new SportVO(sport).toJSON() : null

    let teamPlayerVO
    if (teamPlayer) {
      teamPlayerVO = { details: teamPlayer.details }
    }

    return {
      id,
      name,
      unitId,
      sportId,
      sport: sportVO,
      teamPlayer: teamPlayerVO,
      createdAt,
      updatedAt
    }
  }

  static parseCollection(teams) {
    return teams.map((team) => new TeamVO(team).toJSON())
  }
}

module.exports = TeamVO
