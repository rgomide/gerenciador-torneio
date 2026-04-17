const MatchVO = require('./MatchVO')

class MatchSnapshotVO {
  constructor(matchSnapshot) {
    this.matchSnapshot = matchSnapshot
  }

  /**
   * Reidrata o mesmo formato consolidado de `fromMatch` a partir de um registro
   * persistido em `match_snapshots` (uso em APIs públicas / dashboard).
   */
  static fromPersistedSnapshot(snapshotRow) {
    if (!snapshotRow) {
      return null
    }

    const s = typeof snapshotRow.get === 'function' ? snapshotRow.get({ plain: true }) : snapshotRow

    return {
      matchId: s.matchId,
      matchDate: s.matchDate,
      matchLocation: s.matchLocation,
      matchRoundNumber: s.matchRoundNumber,
      matchOccurrences: s.matchOccurrences,
      tournamentId: s.tournamentId,
      tournamentName: s.tournamentName,
      tournamentStartDate: s.tournamentStartDate,
      tournamentEndDate: s.tournamentEndDate,
      tournamentFinished: s.tournamentFinished,
      eventId: s.eventId,
      eventName: s.eventName,
      eventStartDate: s.eventStartDate,
      eventEndDate: s.eventEndDate,
      unitId: s.unitId,
      unitName: s.unitName,
      institutionId: s.institutionId,
      institutionName: s.institutionName,
      sportId: s.sportId,
      sportName: s.sportName,
      matchScores: s.matchScores,
      matchParticipants: s.matchParticipants,
      totalScores: s.totalScores,
      snapshotTakenAt: s.snapshotTakenAt
    }
  }

  static fromMatch(match) {
    match = match.toJSON()

    const {
      id: matchId,
      date: matchDate,
      location: matchLocation,
      roundNumber: matchRoundNumber,
      occurrences: matchOccurrences,
      tournament: {
        id: tournamentId,
        name: tournamentName,
        startDate: tournamentStartDate,
        endDate: tournamentEndDate,
        finished: tournamentFinished = false,
        sport: { id: sportId, name: sportName } = {},
        event: {
          id: eventId,
          name: eventName,
          startDate: eventStartDate,
          endDate: eventEndDate,
          unit: {
            id: unitId,
            name: unitName,
            institution: { id: institutionId, name: institutionName } = {}
          } = {}
        } = {}
      }
    } = match

    const matchParticipants = match.participants.map((participant) => {
      const id = participant.team?.id || participant.player?.id
      const name = participant.team?.name || participant.player?.name
      const participantType = participant.participantType

      return {
        id,
        participantType,
        name
      }
    })

    const matchScores = match.scores.map((score) => {
      const id = score.team?.id || score.player?.id
      const name = score.team?.name || score.player?.name

      const { participantType, score: scoreValue, details } = score

      return {
        id,
        participantType,
        name,
        score: scoreValue,
        details
      }
    })

    const matchVO = new MatchVO(match)

    const totalScores = matchVO.toJSON().totalScores

    return {
      matchId,
      matchDate,
      matchLocation,
      matchRoundNumber,
      matchOccurrences,
      tournamentId,
      tournamentName,
      tournamentStartDate,
      tournamentEndDate,
      tournamentFinished,
      eventId,
      eventName,
      eventStartDate,
      eventEndDate,
      unitId,
      unitName,
      institutionId,
      institutionName,
      sportId,
      sportName,
      matchScores,
      matchParticipants,
      totalScores
    }
  }
}

module.exports = MatchSnapshotVO
