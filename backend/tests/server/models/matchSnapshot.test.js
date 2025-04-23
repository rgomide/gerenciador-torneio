const { MatchSnapshot } = require('@server/models')

describe('MatchSnapshot Model', () => {
  it('should create a valid match snapshot', async () => {
    const matchSnapshot = await MatchSnapshot.create({
      matchId: 1,
      matchDate: new Date(),
      matchLocation: 'Gymnasium A',
      matchRoundNumber: 1,
      matchOccurrences: 'Some occurrences',

      tournamentId: 1,
      tournamentName: 'Tournament 1',
      tournamentStartDate: new Date(),
      tournamentEndDate: new Date(),

      eventId: 1,
      eventName: 'Event 1',
      eventStartDate: new Date(),
      eventEndDate: new Date(),

      unitId: 1,
      unitName: 'Unit 1',

      institutionId: 1,
      institutionName: 'Institution 1',

      sportId: 1,
      sportName: 'Basketball',

      matchScores: [
        {
          participantType: 'team',
          id: '1',
          score: 10,
          name: 'Team A',
          details: 'First quarter'
        }
      ],
      matchParticipants: [
        {
          participantType: 'team',
          id: '1',
          name: 'Team A'
        }
      ]
    })

    expect(matchSnapshot).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        matchId: '1',
        matchLocation: 'Gymnasium A',
        matchRoundNumber: 1,
        matchOccurrences: 'Some occurrences',
        tournamentId: '1',
        tournamentName: 'Tournament 1',
        eventId: '1',
        eventName: 'Event 1',
        unitId: '1',
        unitName: 'Unit 1',
        institutionId: '1',
        institutionName: 'Institution 1',
        sportId: '1',
        sportName: 'Basketball',
        matchScores: expect.any(Array),
        matchParticipants: expect.any(Array),
        snapshotTakenAt: expect.any(Date),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    )
  })

  it('should require matchId', async () => {
    await expect(
      MatchSnapshot.create({
        matchDate: new Date(),
        tournamentId: 1,
        tournamentName: 'Tournament 1',
        tournamentStartDate: new Date(),
        tournamentEndDate: new Date(),
        eventId: 1,
        eventName: 'Event 1',
        eventStartDate: new Date(),
        eventEndDate: new Date(),
        unitId: 1,
        unitName: 'Unit 1',
        institutionId: 1,
        institutionName: 'Institution 1',
        sportId: 1,
        sportName: 'Basketball',
        matchScores: [],
        matchParticipants: []
      })
    ).rejects.toThrow()
  })

  it('should require tournamentId', async () => {
    await expect(
      MatchSnapshot.create({
        matchId: 1,
        matchDate: new Date(),
        tournamentName: 'Tournament 1',
        tournamentStartDate: new Date(),
        tournamentEndDate: new Date(),
        eventId: 1,
        eventName: 'Event 1',
        eventStartDate: new Date(),
        eventEndDate: new Date(),
        unitId: 1,
        unitName: 'Unit 1',
        institutionId: 1,
        institutionName: 'Institution 1',
        sportId: 1,
        sportName: 'Basketball',
        matchScores: [],
        matchParticipants: []
      })
    ).rejects.toThrow()
  })

  it('should require eventId', async () => {
    await expect(
      MatchSnapshot.create({
        matchId: 1,
        matchDate: new Date(),
        tournamentId: 1,
        tournamentName: 'Tournament 1',
        tournamentStartDate: new Date(),
        tournamentEndDate: new Date(),
        eventName: 'Event 1',
        eventStartDate: new Date(),
        eventEndDate: new Date(),
        unitId: 1,
        unitName: 'Unit 1',
        institutionId: 1,
        institutionName: 'Institution 1',
        sportId: 1,
        sportName: 'Basketball',
        matchScores: [],
        matchParticipants: []
      })
    ).rejects.toThrow()
  })

  it('should require unitId', async () => {
    await expect(
      MatchSnapshot.create({
        matchId: 1,
        matchDate: new Date(),
        tournamentId: 1,
        tournamentName: 'Tournament 1',
        tournamentStartDate: new Date(),
        tournamentEndDate: new Date(),
        eventId: 1,
        eventName: 'Event 1',
        eventStartDate: new Date(),
        eventEndDate: new Date(),
        unitName: 'Unit 1',
        institutionId: 1,
        institutionName: 'Institution 1',
        sportId: 1,
        sportName: 'Basketball',
        matchScores: [],
        matchParticipants: []
      })
    ).rejects.toThrow()
  })

  it('should require institutionId', async () => {
    await expect(
      MatchSnapshot.create({
        matchId: 1,
        matchDate: new Date(),
        tournamentId: 1,
        tournamentName: 'Tournament 1',
        tournamentStartDate: new Date(),
        tournamentEndDate: new Date(),
        eventId: 1,
        eventName: 'Event 1',
        eventStartDate: new Date(),
        eventEndDate: new Date(),
        unitId: 1,
        unitName: 'Unit 1',
        institutionName: 'Institution 1',
        sportId: 1,
        sportName: 'Basketball',
        matchScores: [],
        matchParticipants: []
      })
    ).rejects.toThrow()
  })

  it('should require sportId', async () => {
    await expect(
      MatchSnapshot.create({
        matchId: 1,
        matchDate: new Date(),
        tournamentId: 1,
        tournamentName: 'Tournament 1',
        tournamentStartDate: new Date(),
        tournamentEndDate: new Date(),
        eventId: 1,
        eventName: 'Event 1',
        eventStartDate: new Date(),
        eventEndDate: new Date(),
        unitId: 1,
        unitName: 'Unit 1',
        institutionId: 1,
        institutionName: 'Institution 1',
        sportName: 'Basketball',
        matchScores: [],
        matchParticipants: []
      })
    ).rejects.toThrow()
  })

  it('should require matchScores', async () => {
    await expect(
      MatchSnapshot.create({
        matchId: 1,
        matchDate: new Date(),
        tournamentId: 1,
        tournamentName: 'Tournament 1',
        tournamentStartDate: new Date(),
        tournamentEndDate: new Date(),
        eventId: 1,
        eventName: 'Event 1',
        eventStartDate: new Date(),
        eventEndDate: new Date(),
        unitId: 1,
        unitName: 'Unit 1',
        institutionId: 1,
        institutionName: 'Institution 1',
        sportId: 1,
        sportName: 'Basketball',
        matchParticipants: []
      })
    ).rejects.toThrow()
  })

  it('should require matchParticipants', async () => {
    await expect(
      MatchSnapshot.create({
        matchId: 1,
        matchDate: new Date(),
        tournamentId: 1,
        tournamentName: 'Tournament 1',
        tournamentStartDate: new Date(),
        tournamentEndDate: new Date(),
        eventId: 1,
        eventName: 'Event 1',
        eventStartDate: new Date(),
        eventEndDate: new Date(),
        unitId: 1,
        unitName: 'Unit 1',
        institutionId: 1,
        institutionName: 'Institution 1',
        sportId: 1,
        sportName: 'Basketball',
        matchScores: []
      })
    ).rejects.toThrow()
  })
})
