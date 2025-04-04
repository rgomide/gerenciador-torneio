const eventService = require('@server/services/event.service')
const { Event, Unit, Institution } = require('@server/models')
const AppError = require('@server/utils/AppError')

describe('Event Service', () => {
  describe('create', () => {
    it('should create an event', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })

      const eventData = {
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      }

      const event = await eventService.create(eventData)

      expect(event.toJSON()).toEqual(
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

    it('should throw AppError when unit does not exist', async () => {
      const eventData = {
        name: 'Test Event',
        unitId: '999999',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      }

      await expect(eventService.create(eventData)).rejects.toThrow('Unit not found')
    })
  })

  describe('findAll', () => {
    it('should return all events with their units', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      await Event.create({
        name: 'Test Event 1',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      await Event.create({
        name: 'Test Event 2',
        unitId: unit.id,
        startDate: new Date('2024-01-03'),
        endDate: new Date('2024-01-04')
      })

      const events = await eventService.findAll()

      expect(events).toHaveLength(2)
      events.forEach((event) => {
        expect(event.toJSON()).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: expect.stringMatching(/Test Event [12]/),
            unitId: unit.id,
            startDate: expect.any(Date),
            endDate: expect.any(Date),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            unit: expect.objectContaining({
              id: unit.id,
              name: unit.name
            })
          })
        )
      })
    })
  })

  describe('findByUnit', () => {
    it('should return all events for a unit', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      await Event.create({
        name: 'Test Event 1',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      await Event.create({
        name: 'Test Event 2',
        unitId: unit.id,
        startDate: new Date('2024-01-03'),
        endDate: new Date('2024-01-04')
      })

      const events = await eventService.findByUnit(unit.id)

      expect(events).toHaveLength(2)
      events.forEach((event) => {
        expect(event.toJSON()).toEqual(
          expect.objectContaining({
            unitId: unit.id,
            unit: expect.objectContaining({
              id: unit.id,
              name: unit.name
            })
          })
        )
      })
    })

    it('should throw AppError when unit does not exist', async () => {
      await expect(eventService.findByUnit('999999')).rejects.toThrow(AppError)
    })
  })

  describe('findById', () => {
    it('should return event by id with unit', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const foundEvent = await eventService.findById(event.id)

      expect(foundEvent.toJSON()).toEqual(
        expect.objectContaining({
          id: event.id,
          name: event.name,
          unitId: unit.id,
          startDate: event.startDate,
          endDate: event.endDate,
          unit: expect.objectContaining({
            id: unit.id,
            name: unit.name
          })
        })
      )
    })

    it('should throw AppError when event does not exist', async () => {
      await expect(eventService.findById('999999')).rejects.toThrow(AppError)
    })
  })

  describe('update', () => {
    it('should update event', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const updatedData = {
        name: 'Updated Event',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-02')
      }

      const updatedEvent = await eventService.update(event.id, updatedData)

      expect(updatedEvent.toJSON()).toEqual(
        expect.objectContaining({
          id: event.id,
          name: updatedData.name,
          unitId: unit.id,
          startDate: updatedData.startDate,
          endDate: updatedData.endDate,
          unit: expect.objectContaining({
            id: unit.id,
            name: unit.name
          })
        })
      )
    })

    it('should throw AppError when event does not exist', async () => {
      await expect(eventService.update('999999', { name: 'Updated Event' })).rejects.toThrow(
        AppError
      )
    })

    it('should throw AppError when updating to non-existent unit', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      await expect(eventService.update(event.id, { unitId: '999999' })).rejects.toThrow(AppError)
    })
  })

  describe('remove', () => {
    it('should remove event', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      await eventService.remove(event.id)

      const foundEvent = await Event.findByPk(event.id)
      expect(foundEvent).toBeNull()
    })

    it('should throw AppError when event does not exist', async () => {
      await expect(eventService.remove('999999')).rejects.toThrow(AppError)
    })
  })
})
