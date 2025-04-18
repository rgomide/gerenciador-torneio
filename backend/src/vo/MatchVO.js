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
      scores,
      createdAt,
      updatedAt
    } = this.match

    let totalScores = null

    if (scores) {
      totalScores = []

      Map.groupBy(scores, (score) => {
        return `${score.participantType}${score.teamId || score.playerId}`
      }).forEach((participantScores) => {
        const totalScore = participantScores.reduce((acc, score) => {
          return acc + score.score
        }, 0)

        totalScores.push({
          id: participantScores[0].teamId || participantScores[0].playerId,
          name: participantScores[0].team?.name || participantScores[0].player?.name,
          totalScore: totalScore
        })
      })
    }

    return {
      id,
      tournamentId,
      date,
      location,
      finished,
      occurrences,
      roundNumber,
      totalScores,
      createdAt,
      updatedAt
    }
  }

  static parseCollection(matches) {
    return matches.map((match) => new MatchVO(match).toJSON())
  }
}

module.exports = MatchVO
