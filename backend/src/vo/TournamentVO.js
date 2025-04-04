class TournamentVO {
  constructor(tournament) {
    this.tournament = tournament
  }

  toJSON() {
    const { id, name, eventId, startDate, endDate, createdAt, updatedAt } = this.tournament

    return {
      id,
      name,
      eventId,
      startDate,
      endDate,
      createdAt,
      updatedAt
    }
  }

  static parseCollection(tournaments) {
    return tournaments.map((tournament) => new TournamentVO(tournament).toJSON())
  }
}

module.exports = TournamentVO
