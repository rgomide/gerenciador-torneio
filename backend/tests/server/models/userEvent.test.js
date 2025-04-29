const { UserEvent, User, Event, Institution, Unit } = require('@server/models')

describe('UserEvent Model', () => {
  it('should create a userEvent with valid data', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    })

    const event = await Event.create({
      name: 'Test Event',
      description: 'Test Description',
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000),
      unitId: unit.id
    })

    const userEvent = await UserEvent.create({
      userId: user.id,
      eventId: event.id
    })

    expect(userEvent).toEqual(
      expect.objectContaining({
        userId: user.id,
        eventId: event.id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    )
  })

  it('should belong to a user', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    })

    const event = await Event.create({
      name: 'Test Event',
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000),
      unitId: unit.id
    })

    await UserEvent.create({
      userId: user.id,
      eventId: event.id
    })

    const foundUserEvent = await UserEvent.findOne({
      where: { eventId: event.id, userId: user.id },
      include: [{ model: User, as: 'user' }]
    })

    expect(foundUserEvent.user).toEqual(
      expect.objectContaining({
        id: user.id,
        firstName: 'Test',
        lastName: 'User',
        userName: 'testuser',
        email: 'test@example.com'
      })
    )
  })

  it('should belong to an event', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    })

    const event = await Event.create({
      name: 'Test Event',
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000),
      unitId: unit.id
    })

    const userEvent = await UserEvent.create({
      userId: user.id,
      eventId: event.id
    })

    const foundUserEvent = await UserEvent.findOne({
      where: { eventId: event.id, userId: user.id },
      include: [{ model: Event, as: 'event' }]
    })

    expect(foundUserEvent.event).toEqual(
      expect.objectContaining({
        id: event.id,
        name: 'Test Event'
      })
    )
  })

  it('should not create userEvent without user_id', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const event = await Event.create({
      name: 'Test Event',
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000),
      unitId: unit.id
    })

    await expect(
      UserEvent.create({
        eventId: event.id
      })
    ).rejects.toThrow()
  })

  it('should not create userEvent without event_id', async () => {
    const user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    })

    await expect(
      UserEvent.create({
        userId: user.id
      })
    ).rejects.toThrow()
  })

  it('should not allow duplicate user-event combinations', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    })

    const event = await Event.create({
      name: 'Test Event',
      description: 'Test Description',
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000),
      unitId: unit.id
    })

    await UserEvent.create({
      userId: user.id,
      eventId: event.id
    })

    await expect(
      UserEvent.create({
        userId: user.id,
        eventId: event.id
      })
    ).rejects.toThrow()
  })

  it('should delete userEvent when user is deleted', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    })

    const event = await Event.create({
      name: 'Test Event',
      description: 'Test Description',
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000),
      unitId: unit.id
    })

    const userEvent = await UserEvent.create({
      userId: user.id,
      eventId: event.id
    })

    await user.destroy()
    const foundUserEvent = await UserEvent.findByPk(userEvent.id)
    expect(foundUserEvent).toBeNull()
  })

  it('should delete userEvent when event is deleted', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    })

    const event = await Event.create({
      name: 'Test Event',
      unitId: unit.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000)
    })

    const userEvent = await UserEvent.create({
      userId: user.id,
      eventId: event.id
    })

    await event.destroy()
    const foundUserEvent = await UserEvent.findByPk(userEvent.id)
    expect(foundUserEvent).toBeNull()
  })
})
