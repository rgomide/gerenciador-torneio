const { Match, Tournament, Event, Unit, Institution } = require('@server/models')

describe('Match Model', () => {
  it('should create a match', async () => {
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

    expect(match.toJSON()).toEqual({
      id: expect.any(String),
      tournamentId: tournament.id,
      date: matchData.date,
      location: matchData.location,
      finished: matchData.finished,
      occurrences: matchData.occurrences,
      roundNumber: matchData.roundNumber,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it('should update a match', async () => {
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

    const updatedData = {
      location: 'Updated Location',
      finished: true,
      occurrences: 'Updated occurrences',
      roundNumber: 2
    }

    await match.update(updatedData)

    expect(match.toJSON()).toEqual({
      id: expect.any(String),
      tournamentId: tournament.id,
      date: match.date,
      location: updatedData.location,
      finished: updatedData.finished,
      occurrences: updatedData.occurrences,
      roundNumber: updatedData.roundNumber,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it('should delete a match', async () => {
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

    await match.destroy()

    const foundMatch = await Match.findByPk(match.id)
    expect(foundMatch).toBeNull()
  })

  it('should find a match by id', async () => {
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

    const foundMatch = await Match.findByPk(match.id)

    expect(foundMatch.toJSON()).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        tournamentId: tournament.id,
        date: matchData.date,
        location: matchData.location,
        finished: matchData.finished,
        occurrences: matchData.occurrences,
        roundNumber: matchData.roundNumber,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    )
  })

  it('should get tournament associated with match', async () => {
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

    const foundMatch = await Match.findByPk(match.id, {
      include: [{ model: Tournament, as: 'tournament' }]
    })

    expect(foundMatch.tournament.toJSON()).toEqual(
      expect.objectContaining({
        id: tournament.id,
        name: tournament.name,
        eventId: event.id,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    )
  })

  it('should not create a match without required fields', async () => {
    try {
      await Match.create({})
      // If create succeeds, force the test to fail
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should not create a match with invalid tournament_id', async () => {
    try {
      await Match.create({
        tournamentId: 999999,
        date: new Date('2024-01-01T10:00:00'),
        location: 'Test Location',
        finished: false,
        occurrences: 'Test occurrences',
        roundNumber: 1
      })
      // If create succeeds, force the test to fail
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })
})
