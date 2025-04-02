const { Institution } = require('@server/models')

describe('Institution Model', () => {
  it('should create an institution successfully', async () => {
    const institutionData = {
      name: 'Test Institution'
    }

    const institution = await Institution.create(institutionData)
    expect(institution.name).toBe(institutionData.name)
  })

  it('should not create an institution with empty name', async () => {
    const institutionData = {
      name: ''
    }

    await expect(Institution.create(institutionData)).rejects.toThrow()
  })

  it('should trim whitespace from name', async () => {
    const institutionData = {
      name: '  Test Institution  '
    }

    const institution = await Institution.create(institutionData)
    expect(institution.name).toBe('Test Institution')
  })

  it('should update an institution successfully', async () => {
    const institution = await Institution.create({
      name: 'Original Name'
    })

    const updatedInstitution = await institution.update({
      name: 'Updated Name'
    })

    expect(updatedInstitution.name).toBe('Updated Name')
  })

  it('should delete an institution successfully', async () => {
    const institution = await Institution.create({
      name: 'To Be Deleted'
    })

    await institution.destroy()

    const deletedInstitution = await Institution.findByPk(institution.id)
    expect(deletedInstitution).toBeNull()
  })
})
