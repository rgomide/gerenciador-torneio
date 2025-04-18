const {
  MatchScore,
  Match,
  Team,
  Player,
  Tournament,
  Event,
  Unit,
  Institution,
  Sport
} = require('@server/models')

describe('MatchScore Model', () => {
  it('should create a team score', async () => {
    const institution = await Institution.create({ name: 'Test Institution' })
    const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
    const event = await Event.create({
      name: 'Test Event',
      unitId: unit.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-02')
    })
    const tournament = await Tournament.create({
      name: 'Test Tournament',
      eventId: event.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-02')
    })
    const match = await Match.create({
      tournamentId: tournament.id,
      date: new Date('2024-01-01T10:00:00'),
      location: 'Test Location',
      finished: false,
      occurrences: 'Test occurrences',
      roundNumber: 1
    })

    const sport = await Sport.create({
      name: 'Test Sport',
      description: 'Test Description'
    })

    const team = await Team.create({
      name: 'Test Team',
      description: 'Test Description',
      unitId: unit.id,
      sportId: sport.id
    })

    const matchScore = await MatchScore.create({
      matchId: match.id,
      participantType: 'team',
      teamId: team.id,
      score: 10,
      details: 'Test details'
    })

    expect(matchScore.toJSON()).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        matchId: match.id,
        participantType: 'team',
        teamId: team.id,
        playerId: null,
        score: 10,
        details: 'Test details',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    )
  })

  it('should create a player score', async () => {
    const institution = await Institution.create({ name: 'Test Institution' })
    const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
    const event = await Event.create({
      name: 'Test Event',
      unitId: unit.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-02')
    })
    const tournament = await Tournament.create({
      name: 'Test Tournament',
      eventId: event.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-02')
    })
    const match = await Match.create({
      tournamentId: tournament.id,
      date: new Date('2024-01-01T10:00:00'),
      location: 'Test Location',
      finished: false,
      occurrences: 'Test occurrences',
      roundNumber: 1
    })

    const player = await Player.create({
      name: 'Test Player',
      email: 'test@example.com',
      unitId: unit.id
    })

    const matchScore = await MatchScore.create({
      matchId: match.id,
      participantType: 'player',
      playerId: player.id,
      score: 15,
      details: 'Test details'
    })

    expect(matchScore.toJSON()).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        matchId: match.id,
        participantType: 'player',
        teamId: null,
        playerId: player.id,
        score: 15,
        details: 'Test details',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    )
  })

  it('should not create a score without matchId', async () => {
    const matchScore = MatchScore.build({
      participantType: 'team',
      teamId: '1',
      score: 10
    })

    await expect(matchScore.validate()).rejects.toThrow()
  })

  it('should not create a score without participantType', async () => {
    const matchScore = MatchScore.build({
      matchId: '1',
      teamId: '1',
      score: 10
    })

    await expect(matchScore.validate()).rejects.toThrow()
  })

  it('should not create a score without score', async () => {
    const matchScore = MatchScore.build({
      matchId: '1',
      participantType: 'team',
      teamId: '1'
    })

    await expect(matchScore.validate()).rejects.toThrow()
  })

  it('should not create a team score without teamId', async () => {
    const matchScore = MatchScore.build({
      matchId: '1',
      participantType: 'team',
      score: 10
    })

    await expect(matchScore.validate()).rejects.toThrow()
  })

  it('should not create a player score without playerId', async () => {
    const matchScore = MatchScore.build({
      matchId: '1',
      participantType: 'player',
      score: 10
    })

    await expect(matchScore.validate()).rejects.toThrow()
  })

  it('should not create a score with both teamId and playerId', async () => {
    const matchScore = MatchScore.build({
      matchId: '1',
      participantType: 'team',
      teamId: '1',
      playerId: '1',
      score: 10
    })

    await expect(matchScore.validate()).rejects.toThrow()
  })

  it('should not create a score with invalid participantType', async () => {
    const matchScore = MatchScore.build({
      matchId: '1',
      participantType: 'invalid',
      teamId: '1',
      score: 10
    })

    await expect(matchScore.validate()).rejects.toThrow()
  })
})
