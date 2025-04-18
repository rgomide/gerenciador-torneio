class MatchParticipantVO {
  constructor(matchParticipant) {
    this.matchParticipant = matchParticipant
  }

  toJSON() {
    const { id, matchId, participantType, team, player, teamId, playerId, createdAt, updatedAt } =
      this.matchParticipant

    return {
      id,
      matchId,
      participantType,
      teamId,
      playerId,
      team,
      player,
      createdAt,
      updatedAt
    }
  }

  static parseCollection(matchParticipants) {
    return matchParticipants.map((matchParticipant) =>
      new MatchParticipantVO(matchParticipant).toJSON()
    )
  }
}

module.exports = MatchParticipantVO
