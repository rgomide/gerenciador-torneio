const {
  MatchParticipant,
  Match,
  Team,
  Player,
  Tournament,
  Sport,
  Unit,
  Event,
  Institution
} = require('@server/models')

describe('MatchParticipant', () => {
  it('should create a match participant with team', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const sport = await Sport.create({
      name: 'Test Sport'
    })

    const event = await Event.create({
      name: 'Test Event',
      unitId: unit.id,
      startDate: new Date(),
      endDate: new Date()
    })

    const tournament = await Tournament.create({
      name: 'Test Tournament',
      eventId: event.id,
      startDate: new Date(),
      endDate: new Date()
    })

    const match = await Match.create({
      tournamentId: tournament.id,
      date: new Date(),
      finished: false
    })

    const team = await Team.create({
      name: 'Test Team',
      sportId: sport.id,
      unitId: unit.id
    })

    const matchParticipant = await MatchParticipant.create({
      matchId: match.id,
      participantType: 'team',
      teamId: team.id
    })

    expect(matchParticipant.toJSON()).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        matchId: match.id,
        participantType: 'team',
        teamId: team.id,
        playerId: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    )
  })

  it('should create a match participant with player', async () => {
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
      startDate: new Date(),
      endDate: new Date()
    })

    const tournament = await Tournament.create({
      name: 'Test Tournament',
      eventId: event.id,
      startDate: new Date(),
      endDate: new Date()
    })

    const match = await Match.create({
      tournamentId: tournament.id,
      date: new Date(),
      finished: false
    })

    const player = await Player.create({
      name: 'Test Player',
      email: 'test@example.com',
      unitId: unit.id
    })

    const matchParticipant = await MatchParticipant.create({
      matchId: match.id,
      participantType: 'player',
      playerId: player.id
    })

    expect(matchParticipant).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        matchId: match.id,
        participantType: 'player',
        playerId: player.id,
        teamId: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    )
  })

  it('should not allow creating a match participant with both team and player', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const sport = await Sport.create({
      name: 'Test Sport'
    })

    const event = await Event.create({
      name: 'Test Event',
      unitId: unit.id,
      startDate: new Date(),
      endDate: new Date()
    })

    const tournament = await Tournament.create({
      name: 'Test Tournament',
      eventId: event.id,
      startDate: new Date(),
      endDate: new Date()
    })

    const match = await Match.create({
      tournamentId: tournament.id,
      date: new Date(),
      finished: false
    })

    const team = await Team.create({
      name: 'Test Team',
      sportId: sport.id,
      unitId: unit.id
    })

    const player = await Player.create({
      name: 'Test Player',
      email: 'test@example.com',
      unitId: unit.id
    })

    await expect(
      MatchParticipant.create({
        matchId: match.id,
        participantType: 'team',
        teamId: team.id,
        playerId: player.id
      })
    ).rejects.toThrow()
  })

  it('should not allow creating a match participant without team or player', async () => {
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
      startDate: new Date(),
      endDate: new Date()
    })

    const tournament = await Tournament.create({
      name: 'Test Tournament',
      eventId: event.id,
      startDate: new Date(),
      endDate: new Date()
    })

    const match = await Match.create({
      tournamentId: tournament.id,
      date: new Date(),
      finished: false
    })

    await expect(
      MatchParticipant.create({
        matchId: match.id,
        participantType: 'team'
      })
    ).rejects.toThrow()
  })

  it('should not allow creating a match participant with invalid participant type', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const sport = await Sport.create({
      name: 'Test Sport'
    })

    const event = await Event.create({
      name: 'Test Event',
      unitId: unit.id,
      startDate: new Date(),
      endDate: new Date()
    })

    const tournament = await Tournament.create({
      name: 'Test Tournament',
      eventId: event.id,
      startDate: new Date(),
      endDate: new Date()
    })

    const match = await Match.create({
      tournamentId: tournament.id,
      date: new Date(),
      finished: false
    })

    const team = await Team.create({
      name: 'Test Team',
      sportId: sport.id,
      unitId: unit.id
    })

    await expect(
      MatchParticipant.create({
        matchId: match.id,
        participantType: 'invalid',
        teamId: team.id
      })
    ).rejects.toThrow()
  })

  it('should not allow duplicate team participation in same match', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const sport = await Sport.create({
      name: 'Test Sport'
    })

    const event = await Event.create({
      name: 'Test Event',
      unitId: unit.id,
      startDate: new Date(),
      endDate: new Date()
    })

    const tournament = await Tournament.create({
      name: 'Test Tournament',
      eventId: event.id,
      startDate: new Date(),
      endDate: new Date()
    })

    const match = await Match.create({
      tournamentId: tournament.id,
      date: new Date(),
      finished: false
    })

    const team = await Team.create({
      name: 'Test Team',
      sportId: sport.id,
      unitId: unit.id
    })

    let gosta = await MatchParticipant.create({
      matchId: match.id,
      participantType: 'team',
      teamId: team.id
    })

    await expect(
      MatchParticipant.create({
        matchId: match.id,
        participantType: 'team',
        teamId: team.id
      })
    ).rejects.toThrow()
  })

  it('should not allow duplicate player participation in same match', async () => {
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
      startDate: new Date(),
      endDate: new Date()
    })

    const tournament = await Tournament.create({
      name: 'Test Tournament',
      eventId: event.id,
      startDate: new Date(),
      endDate: new Date()
    })

    const match = await Match.create({
      tournamentId: tournament.id,
      date: new Date(),
      finished: false
    })

    const player = await Player.create({
      name: 'Test Player',
      email: 'test@example.com',
      unitId: unit.id
    })

    await MatchParticipant.create({
      matchId: match.id,
      participantType: 'player',
      playerId: player.id
    })

    await expect(
      MatchParticipant.create({
        matchId: match.id,
        participantType: 'player',
        playerId: player.id
      })
    ).rejects.toThrow()
  })
})
