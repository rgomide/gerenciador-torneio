class TeamPlayerVO {
  constructor(team) {
    this.team = team
  }

  toJSON() {
    const { teamId, playerId, details, createdAt, updatedAt } = this.team

    return {
      teamId,
      playerId,
      details,
      createdAt,
      updatedAt
    }
  }

  static parseCollection(teams) {
    return teams.map((team) => new TeamPlayerVO(team).toJSON())
  }
}

module.exports = TeamPlayerVO
