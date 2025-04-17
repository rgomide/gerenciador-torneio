const { Player, Unit, Institution } = require('@server/models')

describe('Player Model', () => {
  it('should create a player successfully', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const playerData = {
      name: 'Test Player',
      email: 'test@example.com',
      phone: '(11) 99999-9999',
      unitId: unit.id
    }

    const player = await Player.create(playerData)
    expect(player.toJSON()).toEqual(
      expect.objectContaining({
        name: playerData.name,
        email: playerData.email,
        phone: playerData.phone,
        unitId: unit.id,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    )
  })

  it('should not create a player with invalid email', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const playerData = {
      name: 'Test Player',
      email: 'invalid-email',
      phone: '(11) 99999-9999',
      unitId: unit.id
    }

    await expect(Player.create(playerData)).rejects.toThrow()
  })

  it('should not create a player with duplicate email', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const playerData = {
      name: 'Test Player',
      email: 'test@example.com',
      phone: '(11) 99999-9999',
      unitId: unit.id
    }

    await Player.create(playerData)
    await expect(Player.create(playerData)).rejects.toThrow()
  })

  it('should not create a player with invalid unit', async () => {
    const playerData = {
      name: 'Test Player',
      email: 'test@example.com',
      phone: '(11) 99999-9999',
      unitId: 999999 // Non-existent unit ID
    }

    await expect(Player.create(playerData)).rejects.toThrow()
  })

  it('should update a player successfully', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const player = await Player.create({
      name: 'Original Name',
      email: 'original@example.com',
      phone: '(11) 99999-9999',
      unitId: unit.id
    })

    const updatedPlayer = await player.update({
      name: 'Updated Name',
      email: 'updated@example.com'
    })

    expect(updatedPlayer.toJSON()).toEqual(
      expect.objectContaining({
        name: 'Updated Name',
        email: 'updated@example.com',
        phone: '(11) 99999-9999',
        unitId: unit.id,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    )
  })

  it('should delete a player successfully', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const player = await Player.create({
      name: 'To Be Deleted',
      email: 'delete@example.com',
      phone: '(11) 99999-9999',
      unitId: unit.id
    })

    await player.destroy()

    const deletedPlayer = await Player.findByPk(player.id)
    expect(deletedPlayer).toBeNull()
  })

  it('should load unit association', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const player = await Player.create({
      name: 'Test Player',
      email: 'test@example.com',
      phone: '(11) 99999-9999',
      unitId: unit.id
    })

    const loadedPlayer = await Player.findByPk(player.id, {
      include: [
        {
          model: Unit,
          as: 'unit'
        }
      ]
    })

    expect(loadedPlayer.toJSON()).toEqual(
      expect.objectContaining({
        name: 'Test Player',
        email: 'test@example.com',
        phone: '(11) 99999-9999',
        unitId: unit.id,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        unit: expect.objectContaining({
          id: unit.id,
          name: 'Test Unit',
          institutionId: institution.id
        })
      })
    )
  })
})
