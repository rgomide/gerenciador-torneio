const { Unit, Institution } = require('@server/models')

describe('Unit Model', () => {
  it('should create a unit successfully', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unitData = {
      name: 'Test Unit',
      institutionId: institution.id
    }

    const unit = await Unit.create(unitData)
    expect(unit.name).toBe(unitData.name)
    expect(unit.institutionId).toBe(institution.id)

    await unit.destroy()
    await institution.destroy()
  })

  it('should not create a unit with empty name', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unitData = {
      name: '',
      institutionId: institution.id
    }

    await expect(Unit.create(unitData)).rejects.toThrow()
    await institution.destroy()
  })

  it('should trim whitespace from name', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unitData = {
      name: '  Test Unit  ',
      institutionId: institution.id
    }

    const unit = await Unit.create(unitData)
    expect(unit.name).toBe('Test Unit')

    await unit.destroy()
    await institution.destroy()
  })

  it('should not create a unit with invalid institution', async () => {
    const unitData = {
      name: 'Test Unit',
      institutionId: 999999 // Non-existent institution ID
    }

    await expect(Unit.create(unitData)).rejects.toThrow()
  })

  it('should update a unit successfully', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Original Name',
      institutionId: institution.id
    })

    const updatedUnit = await unit.update({
      name: 'Updated Name'
    })

    expect(updatedUnit.name).toBe('Updated Name')

    await unit.destroy()
    await institution.destroy()
  })

  it('should delete a unit successfully', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'To Be Deleted',
      institutionId: institution.id
    })

    await unit.destroy()

    const deletedUnit = await Unit.findByPk(unit.id)
    expect(deletedUnit).toBeNull()

    await institution.destroy()
  })

  it('should load institution association', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const loadedUnit = await Unit.findByPk(unit.id, {
      include: [
        {
          model: Institution,
          as: 'institution'
        }
      ]
    })

    expect(loadedUnit.institution).toBeDefined()
    expect(loadedUnit.institution.id).toBe(institution.id)

    await unit.destroy()
    await institution.destroy()
  })
})
