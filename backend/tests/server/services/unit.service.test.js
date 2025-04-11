const { Unit, Institution } = require('@server/models')
const {
  create,
  findAll,
  findById,
  findByInstitution,
  update,
  remove
} = require('@server/services/unit.service')

describe('Unit Service', () => {
  describe('create', () => {
    it('should create a unit successfully', async () => {
      const institution = await Institution.create({
        name: 'Test Institution'
      })

      const unitData = {
        name: 'Test Unit',
        institutionId: institution.id
      }

      const unit = await create(unitData)

      expect(unit).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: 'Test Unit',
          institutionId: institution.id
        })
      )

      await unit.destroy()
      await institution.destroy()
    })

    it('should throw an error if unit already exists in institution', async () => {
      const institution = await Institution.create({
        name: 'Test Institution'
      })

      const unitData = {
        name: 'Test Unit',
        institutionId: institution.id
      }

      await create(unitData)
      await expect(create(unitData)).rejects.toThrow('Unidade já existe nesta instituição')

      await institution.destroy()
    })

    it('should throw an error if institution does not exist', async () => {
      const unitData = {
        name: 'Test Unit',
        institutionId: '999999'
      }

      await expect(create(unitData)).rejects.toThrow('Instituição não encontrada')
    })

    it('should throw an error if name is not provided', async () => {
      const institution = await Institution.create({
        name: 'Test Institution'
      })

      await expect(create({ institutionId: institution.id })).rejects.toThrow('Nome é obrigatório')
      await institution.destroy()
    })

    it('should throw an error if name is empty string', async () => {
      const institution = await Institution.create({
        name: 'Test Institution'
      })

      await expect(create({ name: '', institutionId: institution.id })).rejects.toThrow(
        'Nome é obrigatório'
      )
      await institution.destroy()
    })

    it('should throw an error if name is only whitespace', async () => {
      const institution = await Institution.create({
        name: 'Test Institution'
      })

      await expect(create({ name: '   ', institutionId: institution.id })).rejects.toThrow(
        'Nome não pode estar vazio'
      )
      await institution.destroy()
    })
  })

  describe('findAll', () => {
    it('should find all units with their institutions', async () => {
      const institution = await Institution.create({
        name: 'Test Institution'
      })

      await Unit.create({
        name: 'Test Unit 1',
        institutionId: institution.id
      })

      await Unit.create({
        name: 'Test Unit 2',
        institutionId: institution.id
      })

      const units = await findAll()

      expect(units).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          name: 'Test Unit 1',
          institutionId: institution.id,
          institution: expect.objectContaining({
            id: institution.id,
            name: 'Test Institution'
          })
        }),
        expect.objectContaining({
          id: expect.any(String),
          name: 'Test Unit 2',
          institutionId: institution.id,
          institution: expect.objectContaining({
            id: institution.id,
            name: 'Test Institution'
          })
        })
      ])

      await institution.destroy()
    })
  })

  describe('findById', () => {
    it('should find a unit by id with institution', async () => {
      const institution = await Institution.create({
        name: 'Test Institution'
      })

      const unit = await Unit.create({
        name: 'Test Unit',
        institutionId: institution.id
      })

      const foundUnit = await findById(unit.id)

      expect(foundUnit).toEqual(
        expect.objectContaining({
          id: unit.id,
          name: 'Test Unit',
          institutionId: institution.id,
          institution: expect.objectContaining({
            id: institution.id,
            name: 'Test Institution'
          })
        })
      )

      await unit.destroy()
      await institution.destroy()
    })

    it('should throw an error if unit is not found', async () => {
      await expect(findById('123')).rejects.toThrow('Unidade não encontrada')
    })
  })

  describe('findByInstitution', () => {
    it('should find all units of an institution', async () => {
      const institution = await Institution.create({
        name: 'Test Institution'
      })

      await Unit.create({
        name: 'Test Unit 1',
        institutionId: institution.id
      })

      await Unit.create({
        name: 'Test Unit 2',
        institutionId: institution.id
      })

      const units = await findByInstitution(institution.id)

      expect(units).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          name: 'Test Unit 1',
          institutionId: institution.id,
          institution: expect.objectContaining({
            id: institution.id,
            name: 'Test Institution'
          })
        }),
        expect.objectContaining({
          id: expect.any(String),
          name: 'Test Unit 2',
          institutionId: institution.id,
          institution: expect.objectContaining({
            id: institution.id,
            name: 'Test Institution'
          })
        })
      ])

      await institution.destroy()
    })

    it('should throw an error if institution is not found', async () => {
      await expect(findByInstitution('123')).rejects.toThrow('Instituição não encontrada')
    })
  })

  describe('update', () => {
    it('should update a unit successfully', async () => {
      const institution = await Institution.create({
        name: 'Test Institution'
      })

      const unit = await Unit.create({
        name: 'Original Name',
        institutionId: institution.id
      })

      const updatedUnit = await update(unit.id, {
        name: 'Updated Name'
      })

      expect(updatedUnit).toEqual(
        expect.objectContaining({
          id: unit.id,
          name: 'Updated Name',
          institutionId: institution.id
        })
      )
    })

    it('should throw an error if unit is not found', async () => {
      await expect(update('123', { name: 'New Name' })).rejects.toThrow('Unidade não encontrada')
    })

    it('should throw an error if new institution does not exist', async () => {
      const institution = await Institution.create({
        name: 'Test Institution'
      })

      const unit = await Unit.create({
        name: 'Test Unit',
        institutionId: institution.id
      })

      await expect(update(unit.id, { institutionId: '999999', name: 'ABc' })).rejects.toThrow(
        'Instituição não encontrada'
      )
    })

    it('should throw an error if name is empty', async () => {
      const institution = await Institution.create({
        name: 'Test Institution'
      })

      const unit = await Unit.create({
        name: 'Test Unit',
        institutionId: institution.id
      })

      await expect(update(unit.id, { name: '' })).rejects.toThrow('Nome é obrigatório')
    })

    it('should throw an error if name is only whitespace', async () => {
      const institution = await Institution.create({
        name: 'Test Institution'
      })

      const unit = await Unit.create({
        name: 'Test Unit',
        institutionId: institution.id
      })

      await expect(update(unit.id, { name: '   ' })).rejects.toThrow('Nome não pode estar vazio')
    })
  })

  describe('remove', () => {
    it('should remove a unit successfully', async () => {
      const institution = await Institution.create({
        name: 'Test Institution'
      })

      const unit = await Unit.create({
        name: 'To Be Deleted',
        institutionId: institution.id
      })

      const result = await remove(unit.id)

      expect(result).toBe(true)

      const deletedUnit = await Unit.findByPk(unit.id)
      expect(deletedUnit).toBeNull()

      await institution.destroy()
    })

    it('should throw an error if unit is not found', async () => {
      await expect(remove('123')).rejects.toThrow('Unidade não encontrada')
    })
  })
})
