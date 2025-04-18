class MatchScoreVO {
  constructor(matchScore) {
    this.matchScore = matchScore
  }

  toJSON() {
    const {
      id,
      matchId,
      participantType,
      team,
      player,
      teamId,
      playerId,
      score,
      details,
      createdAt,
      updatedAt
    } = this.matchScore

    return {
      id,
      matchId,
      participantType,
      teamId,
      playerId,
      team,
      player,
      score,
      details,
      createdAt,
      updatedAt
    }
  }

  static parseCollection(matchScores) {
    return matchScores.map((matchScore) => new MatchScoreVO(matchScore).toJSON())
  }
}

module.exports = MatchScoreVO
