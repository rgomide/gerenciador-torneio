const SportVO = require('./SportVO')
const MatchVO = require('./MatchVO')

class TournamentVO {
  constructor(tournament) {
    this.tournament = tournament
  }

  toJSON() {
    const {
      id,
      name,
      eventId,
      sportId,
      startDate,
      endDate,
      createdAt,
      updatedAt,
      sport,
      finished,
      matches
    } = this.tournament

    const sportVO = sport ? new SportVO(sport).toJSON() : null
    const matchesVO = matches ? matches.map((match) => new MatchVO(match).toJSON()) : null

    return {
      id,
      name,
      eventId,
      startDate,
      endDate,
      createdAt,
      updatedAt,
      sportId,
      sport: sportVO,
      finished,
      matches: matchesVO
    }
  }

  static parseCollection(tournaments) {
    return tournaments.map((tournament) => new TournamentVO(tournament).toJSON())
  }
}

module.exports = TournamentVO
