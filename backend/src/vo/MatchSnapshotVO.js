const {
  Match,
  Tournament,
  Event,
  Unit,
  Institution,
  MatchParticipant,
  MatchScore,
  Team,
  Player
} = require('@server/models')

class MatchSnapshotVO {
  constructor(matchSnapshot) {
    this.matchSnapshot = matchSnapshot
  }

  static async fromMatch(match) {
    match = await Match.findByPk(match.id, {
      include: [
        {
          model: Tournament,
          as: 'tournament',
          include: [
            {
              model: Event,
              as: 'event',
              include: [
                {
                  model: Unit,
                  as: 'unit',
                  include: [
                    {
                      model: Institution,
                      as: 'institution'
                    }
                  ]
                }
              ]
            },
            'sport'
          ]
        },
        {
          model: MatchParticipant,
          as: 'participants',
          include: [
            {
              model: Team,
              as: 'team'
            },
            {
              model: Player,
              as: 'player'
            }
          ]
        },
        {
          model: MatchScore,
          as: 'scores',
          include: [
            {
              model: Team,
              as: 'team'
            },
            {
              model: Player,
              as: 'player'
            }
          ]
        }
      ]
    })

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
      eventName,
      eventEndDate,
      unitId,
      unitName,
      institutionId,
      institutionName,
      sportId,
      sportName,
      matchScores,
      matchParticipants
    }
  }
}

module.exports = MatchSnapshotVO
