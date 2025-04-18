class MatchVO {
  constructor(match) {
    this.match = match
  }

  toJSON() {
    const {
      id,
      tournamentId,
      date,
      location,
      finished,
      occurrences,
      roundNumber,
      createdAt,
      updatedAt
    } = this.match

    return {
      id,
      tournamentId,
      date,
      location,
      finished,
      occurrences,
      roundNumber,
      createdAt,
      updatedAt
    }
  }

  static parseCollection(matches) {
    return matches.map((match) => new MatchVO(match).toJSON())
  }
}

module.exports = MatchVO
