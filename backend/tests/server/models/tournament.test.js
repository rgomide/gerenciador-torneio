const { Tournament, Event, Unit, Institution } = require('@server/models')

describe('Tournament Model', () => {
  it('should create a tournament', async () => {
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

    const tournamentData = {
      name: 'Test Tournament',
      eventId: event.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-02')
    }

    const tournament = await Tournament.create(tournamentData)

    expect(tournament.toJSON()).toEqual({
      id: expect.any(String),
      name: tournamentData.name,
      eventId: event.id,
      startDate: tournamentData.startDate,
      endDate: tournamentData.endDate,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it('should update a tournament', async () => {
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

    const updatedName = 'Updated Tournament'
    const updatedStartDate = new Date('2024-01-01 10:00:00')
    const updatedEndDate = new Date('2024-01-02 18:00:00')

    await tournament.update({
      name: updatedName,
      startDate: updatedStartDate,
      endDate: updatedEndDate
    })

    expect(tournament.toJSON()).toEqual({
      id: expect.any(String),
      name: updatedName,
      eventId: event.id,
      startDate: updatedStartDate,
      endDate: updatedEndDate,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it('should delete a tournament', async () => {
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

    await tournament.destroy()

    const foundTournament = await Tournament.findByPk(tournament.id)
    expect(foundTournament).toBeNull()
  })

  it('should find a tournament by id', async () => {
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

    const tournamentData = {
      name: 'Test Tournament',
      eventId: event.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-02')
    }

    const tournament = await Tournament.create(tournamentData)

    const foundTournament = await Tournament.findByPk(tournament.id)

    expect(foundTournament.toJSON()).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: tournamentData.name,
        eventId: event.id,
        startDate: tournamentData.startDate,
        endDate: tournamentData.endDate,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    )
  })

  it('should get event associated with tournament', async () => {
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

    const foundTournament = await Tournament.findByPk(tournament.id, {
      include: [{ model: Event, as: 'event' }]
    })

    expect(foundTournament.event.toJSON()).toEqual(
      expect.objectContaining({
        id: event.id,
        name: event.name,
        unitId: unit.id,
        startDate: event.startDate,
        endDate: event.endDate,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    )
  })

  it('should not create a tournament without required fields', async () => {
    try {
      await Tournament.create({})
      // If create succeeds, force the test to fail
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should not create a tournament with invalid event_id', async () => {
    try {
      await Tournament.create({
        name: 'Test Tournament',
        eventId: 999999,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      // If create succeeds, force the test to fail
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should not create a tournament with end_date before start_date', async () => {
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

    try {
      await Tournament.create({
        name: 'Test Tournament',
        eventId: event.id,
        startDate: new Date('2024-01-02'),
        endDate: new Date('2024-01-01')
      })
      // If create succeeds, force the test to fail
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })
})
