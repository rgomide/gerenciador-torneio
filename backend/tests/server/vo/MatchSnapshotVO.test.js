const {
  Event,
  Unit,
  Institution,
  Match,
  Tournament,
  MatchParticipant,
  MatchScore,
  MatchSnapshot,
  Team,
  Player,
  Sport
} = require('@server/models')
const MatchSnapshotVO = require('@server/vo/MatchSnapshotVO')

describe('MatchSnapshotVO', () => {
  it('should create a match snapshot from a match', async () => {
    const sport = await Sport.create({
      name: 'Test Sport'
    })

    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const event = await Event.create({
      name: 'Test Event',
      unitId: unit.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-02')
    })

    const tournament = await Tournament.create({
      name: 'Test Tournament',
      eventId: event.id,
      sportId: sport.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-02')
    })

    const matchData = {
      tournamentId: tournament.id,
      date: new Date('2024-01-01T10:00:00'),
      location: 'Test Location',
      finished: false,
      occurrences: 'Test occurrences',
      roundNumber: 1
    }

    const match = await Match.create(matchData)

    const team = await Team.create({
      name: 'Test Team',
      unitId: unit.id,
      sportId: sport.id
    })

    const player = await Player.create({
      name: 'Test Player',
      unitId: unit.id,
      email: 'test@test.com'
    })

    const matchParticipantData = {
      matchId: match.id,
      participantType: 'team',
      teamId: team.id
    }
    const matchParticipantData2 = {
      matchId: match.id,
      participantType: 'player',
      playerId: player.id
    }

    await MatchParticipant.create(matchParticipantData)
    await MatchParticipant.create(matchParticipantData2)

    const matchScoreData = {
      matchId: match.id,
      participantType: 'team',
      teamId: team.id,
      score: 10
    }

    const matchScoreData2 = {
      matchId: match.id,
      participantType: 'player',
      playerId: player.id,
      score: 10,
      details: 'Test details'
    }

    await MatchScore.create(matchScoreData)
    await MatchScore.create(matchScoreData2)

    const matchSnapshot = await MatchSnapshotVO.fromMatch(match)

    const test = await MatchSnapshot.create(matchSnapshot)

    console.log(test.toJSON())

    expect(matchSnapshot).toEqual(
      expect.objectContaining({
        matchId: match.id,
        matchDate: expect.any(Date),
        matchLocation: 'Test Location',
        matchRoundNumber: 1,
        matchOccurrences: 'Test occurrences',
        tournamentId: tournament.id,
        tournamentName: 'Test Tournament',
        tournamentStartDate: expect.any(Date),
        tournamentEndDate: expect.any(Date),
        eventId: event.id,
        eventName: 'Test Event',
        eventStartDate: expect.any(Date),
        eventEndDate: expect.any(Date),
        unitId: unit.id,
        unitName: 'Test Unit',
        institutionId: institution.id,
        institutionName: 'Test Institution',
        sportId: sport.id,
        sportName: 'Test Sport',
        matchScores: [
          {
            id: team.id,
            participantType: 'team',
            name: 'Test Team',
            score: 10,
            details: null
          },
          {
            id: player.id,
            participantType: 'player',
            name: 'Test Player',
            score: 10,
            details: 'Test details'
          }
        ],
        matchParticipants: [
          { id: team.id, participantType: 'team', name: 'Test Team' },
          { id: player.id, participantType: 'player', name: 'Test Player' }
        ]
      })
    )
  })
})
