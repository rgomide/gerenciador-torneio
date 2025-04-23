const SportVO = require('./SportVO')

class TournamentVO {
  constructor(tournament) {
    this.tournament = tournament
  }

  toJSON() {
    const { id, name, eventId, startDate, endDate, createdAt, updatedAt, sport } = this.tournament

    const sportVO = sport ? new SportVO(sport).toJSON() : null

    return {
      id,
      name,
      eventId,
      startDate,
      endDate,
      createdAt,
      updatedAt,
      sport: sportVO
    }
  }

  static parseCollection(tournaments) {
    return tournaments.map((tournament) => new TournamentVO(tournament).toJSON())
  }
}

module.exports = TournamentVO
