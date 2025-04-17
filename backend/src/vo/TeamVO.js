class TeamVO {
  constructor(team) {
    this.team = team
  }

  toJSON() {
    const { id, name, unitId, sportId, createdAt, updatedAt } = this.team

    return {
      id,
      name,
      unitId,
      sportId,
      createdAt,
      updatedAt
    }
  }

  static parseCollection(teams) {
    return teams.map((team) => new TeamVO(team).toJSON())
  }
}

module.exports = TeamVO
