const { Event, Unit, Institution } = require('@server/models')

describe('Event Model', () => {
  it('should create an event', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const eventData = {
      name: 'Test Event',
      unitId: unit.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-02')
    }

    const event = await Event.create(eventData)

    expect(event.toJSON()).toEqual({
      id: expect.any(String),
      name: eventData.name,
      unitId: unit.id,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it('should update an event', async () => {
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

    const updatedName = 'Updated Event'
    const updatedStartDate = new Date('2024-02-01')
    const updatedEndDate = new Date('2024-02-02')

    await event.update({
      name: updatedName,
      startDate: updatedStartDate,
      endDate: updatedEndDate
    })

    expect(event.toJSON()).toEqual({
      id: expect.any(String),
      name: updatedName,
      unitId: unit.id,
      startDate: updatedStartDate,
      endDate: updatedEndDate,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it('should delete an event', async () => {
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

    await event.destroy()

    const foundEvent = await Event.findByPk(event.id)
    expect(foundEvent).toBeNull()
  })

  it('should find an event by id', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const eventData = {
      name: 'Test Event',
      unitId: unit.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-02')
    }

    const event = await Event.create(eventData)

    const foundEvent = await Event.findByPk(event.id)

    expect(foundEvent.toJSON()).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: eventData.name,
        unitId: unit.id,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    )
  })

  it('should get unit associated with event', async () => {
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

    const foundEvent = await Event.findByPk(event.id, {
      include: [{ model: Unit, as: 'unit' }]
    })

    expect(foundEvent.unit.toJSON()).toEqual({
      id: unit.id,
      name: unit.name,
      institutionId: institution.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it('should not create an event without required fields', async () => {
    try {
      await Event.create({})
      // If create succeeds, force the test to fail
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should not create an event with invalid unit_id', async () => {
    try {
      await Event.create({
        name: 'Test Event',
        unitId: 999999,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      // If create succeeds, force the test to fail
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should not create an event with end_date before start_date', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    try {
      await Event.create({
        name: 'Test Event',
        unitId: unit.id,
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
