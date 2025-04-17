const sportService = require('@server/services/sport.service')
const { Sport } = require('@server/models')
const AppError = require('@server/utils/AppError')

describe('Sport Service', () => {
  describe('create', () => {
    it('should create a sport', async () => {
      const sportData = {
        name: 'Futebol'
      }

      const sport = await sportService.create(sportData)

      expect(sport.toJSON()).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: sportData.name,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      )
    })

    it('should throw AppError when name is not provided', async () => {
      const sportData = {}

      await expect(sportService.create(sportData)).rejects.toThrow('Nome é obrigatório')
    })

    it('should throw AppError when name is empty', async () => {
      const sportData = {
        name: ''
      }

      await expect(sportService.create(sportData)).rejects.toThrow('Nome é obrigatório')
    })

    it('should throw AppError when name is only whitespace', async () => {
      const sportData = {
        name: '   '
      }

      await expect(sportService.create(sportData)).rejects.toThrow('Nome não pode estar vazio')
    })
  })

  describe('findAll', () => {
    it('should return all sports', async () => {
      await Sport.create({ name: 'Futebol' })
      await Sport.create({ name: 'Vôlei' })

      const sports = await sportService.findAll()

      expect(sports).toHaveLength(2)
      sports.forEach((sport) => {
        expect(sport.toJSON()).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: expect.stringMatching(/Futebol|Vôlei/),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          })
        )
      })
    })
  })

  describe('findById', () => {
    it('should return sport by id', async () => {
      const sport = await Sport.create({ name: 'Futebol' })

      const foundSport = await sportService.findById(sport.id)

      expect(foundSport.toJSON()).toEqual(
        expect.objectContaining({
          id: sport.id,
          name: sport.name,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      )
    })

    it('should throw AppError when sport does not exist', async () => {
      await expect(sportService.findById('999999')).rejects.toThrow('Esporte não encontrado')
    })
  })

  describe('update', () => {
    it('should update sport', async () => {
      const sport = await Sport.create({ name: 'Futebol' })

      const updatedData = {
        name: 'Futebol de Salão'
      }

      const updatedSport = await sportService.update(sport.id, updatedData)

      expect(updatedSport.toJSON()).toEqual(
        expect.objectContaining({
          id: sport.id,
          name: updatedData.name,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      )
    })

    it('should throw AppError when sport does not exist', async () => {
      const updatedData = {
        name: 'Futebol de Salão'
      }

      await expect(sportService.update('999999', updatedData)).rejects.toThrow(
        'Esporte não encontrado'
      )
    })

    it('should throw AppError when name is not provided', async () => {
      const sport = await Sport.create({ name: 'Futebol' })

      await expect(sportService.update(sport.id, {})).rejects.toThrow('Nome é obrigatório')
    })
  })

  describe('remove', () => {
    it('should remove sport', async () => {
      const sport = await Sport.create({ name: 'Futebol' })

      await sportService.remove(sport.id)

      const foundSport = await Sport.findByPk(sport.id)
      expect(foundSport).toBeNull()
    })

    it('should throw AppError when sport does not exist', async () => {
      await expect(sportService.remove('999999')).rejects.toThrow('Esporte não encontrado')
    })
  })
})
