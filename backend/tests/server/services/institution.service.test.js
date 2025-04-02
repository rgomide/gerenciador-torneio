const { Institution } = require('@server/models')
const {
  create,
  findAll,
  findById,
  update,
  remove
} = require('@server/services/institution.service')

describe('Institution Service', () => {
  describe('create', () => {
    it('should create an institution successfully', async () => {
      const institutionData = {
        name: 'Test Institution'
      }

      const institution = await create(institutionData)

      expect(institution).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: 'Test Institution'
        })
      )
    })

    it('should throw an error if institution already exists', async () => {
      const institutionData = {
        name: 'Test Institution'
      }

      await create(institutionData)
      await expect(create(institutionData)).rejects.toThrow('Institution already exists')
    })
  })

  describe('findAll', () => {
    it('should find all institutions', async () => {
      await Institution.create({
        name: 'Test Institution 1'
      })

      await Institution.create({
        name: 'Test Institution 2'
      })

      const institutions = await findAll()

      expect(institutions).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          name: 'Test Institution 1'
        }),
        expect.objectContaining({
          id: expect.any(String),
          name: 'Test Institution 2'
        })
      ])
    })
  })

  describe('findById', () => {
    it('should find an institution by id', async () => {
      const institution = await Institution.create({
        name: 'Test Institution'
      })

      const foundInstitution = await findById(institution.id)

      expect(foundInstitution).toEqual(
        expect.objectContaining({
          id: institution.id,
          name: 'Test Institution'
        })
      )
    })

    it('should throw an error if institution is not found', async () => {
      await expect(findById('123')).rejects.toThrow('Institution not found')
    })
  })

  describe('update', () => {
    it('should update an institution successfully', async () => {
      const institution = await Institution.create({
        name: 'Original Name'
      })

      const updatedInstitution = await update(institution.id, {
        name: 'Updated Name'
      })

      expect(updatedInstitution).toEqual(
        expect.objectContaining({
          id: institution.id,
          name: 'Updated Name'
        })
      )
    })

    it('should throw an error if institution is not found', async () => {
      await expect(update('123', { name: 'New Name' })).rejects.toThrow('Institution not found')
    })
  })

  describe('remove', () => {
    it('should remove an institution successfully', async () => {
      const institution = await Institution.create({
        name: 'To Be Deleted'
      })

      const result = await remove(institution.id)

      expect(result).toBe(true)

      const deletedInstitution = await Institution.findByPk(institution.id)
      expect(deletedInstitution).toBeNull()
    })

    it('should throw an error if institution is not found', async () => {
      await expect(remove('123')).rejects.toThrow('Institution not found')
    })
  })
})
