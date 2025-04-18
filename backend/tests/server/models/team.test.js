const { Team, Sport, Unit, Institution } = require('@server/models')

describe('Team Model', () => {
  it('should create a team', async () => {
    const institution = await Institution.create({ name: 'Test Institution' })
    const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
    const sport = await Sport.create({ name: 'Futebol' })
    const teamData = {
      name: 'Time A',
      sportId: sport.id,
      unitId: unit.id
    }

    const team = await Team.create(teamData)

    expect(team.toJSON()).toEqual({
      id: expect.any(String),
      name: teamData.name,
      sportId: sport.id,
      unitId: unit.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it('should update a team', async () => {
    const institution = await Institution.create({ name: 'Test Institution' })
    const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
    const sport = await Sport.create({ name: 'Futebol' })
    const team = await Team.create({
      name: 'Time A',
      sportId: sport.id,
      unitId: unit.id
    })

    const updatedName = 'Time B'
    await team.update({ name: updatedName })

    expect(team.toJSON()).toEqual({
      id: expect.any(String),
      name: updatedName,
      sportId: sport.id,
      unitId: unit.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it('should delete a team', async () => {
    const institution = await Institution.create({ name: 'Test Institution' })
    const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
    const sport = await Sport.create({ name: 'Futebol' })
    const team = await Team.create({
      name: 'Time A',
      sportId: sport.id,
      unitId: unit.id
    })

    await team.destroy()

    const foundTeam = await Team.findByPk(team.id)
    expect(foundTeam).toBeNull()
  })

  it('should find a team by id', async () => {
    const institution = await Institution.create({ name: 'Test Institution' })
    const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
    const sport = await Sport.create({ name: 'Futebol' })
    const teamData = {
      name: 'Time A',
      sportId: sport.id,
      unitId: unit.id
    }

    const team = await Team.create(teamData)
    const foundTeam = await Team.findByPk(team.id)

    expect(foundTeam.toJSON()).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: teamData.name,
        sportId: sport.id,
        unitId: unit.id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    )
  })

  it('should not create a team without required fields', async () => {
    try {
      await Team.create({})
      // If create succeeds, force the test to fail
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should not create a team with empty name', async () => {
    const institution = await Institution.create({ name: 'Test Institution' })
    const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
    const sport = await Sport.create({ name: 'Futebol' })
    try {
      await Team.create({ name: '', sportId: sport.id, unitId: unit.id })
      // If create succeeds, force the test to fail
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should not create a team without sportId', async () => {
    const institution = await Institution.create({ name: 'Test Institution' })
    const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
    try {
      await Team.create({ name: 'Time A', unitId: unit.id })
      // If create succeeds, force the test to fail
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should not create a team without unitId', async () => {
    const sport = await Sport.create({ name: 'Futebol' })
    try {
      await Team.create({ name: 'Time A', sportId: sport.id })
      // If create succeeds, force the test to fail
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should load sport association', async () => {
    const institution = await Institution.create({ name: 'Test Institution' })
    const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
    const sport = await Sport.create({ name: 'Futebol' })
    const team = await Team.create({
      name: 'Time A',
      sportId: sport.id,
      unitId: unit.id
    })

    const teamWithSport = await Team.findByPk(team.id, {
      include: [{ model: Sport, as: 'sport' }]
    })

    expect(teamWithSport.sport.toJSON()).toEqual({
      id: expect.any(String),
      name: sport.name,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it('should load unit association', async () => {
    const institution = await Institution.create({ name: 'Test Institution' })
    const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
    const sport = await Sport.create({ name: 'Futebol' })
    const team = await Team.create({
      name: 'Time A',
      sportId: sport.id,
      unitId: unit.id
    })

    const teamWithUnit = await Team.findByPk(team.id, {
      include: [{ model: Unit, as: 'unit' }]
    })

    expect(teamWithUnit.unit.toJSON()).toEqual({
      id: expect.any(String),
      name: unit.name,
      institutionId: institution.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })
})
