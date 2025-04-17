const playerService = require('@server/services/player.service')
const { Player, Unit, Institution } = require('@server/models')
const AppError = require('@server/utils/AppError')

describe('Player Service', () => {
  describe('create', () => {
    it('should create a player', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })

      const playerData = {
        name: 'Test Player',
        email: 'test@example.com',
        phone: '(11) 99999-9999',
        unitId: unit.id
      }

      const player = await playerService.create(playerData)

      expect(player.toJSON()).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: playerData.name,
          email: playerData.email,
          phone: playerData.phone,
          unitId: unit.id,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      )
    })

    it('should throw AppError when unit does not exist', async () => {
      const playerData = {
        name: 'Test Player',
        email: 'test@example.com',
        phone: '(11) 99999-9999',
        unitId: '999999'
      }

      await expect(playerService.create(playerData)).rejects.toThrow('Unidade não encontrada')
    })

    it('should throw AppError when name is not provided', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })

      const playerData = {
        email: 'test@example.com',
        phone: '(11) 99999-9999',
        unitId: unit.id
      }

      await expect(playerService.create(playerData)).rejects.toThrow('Nome é obrigatório')
    })

    it('should throw AppError when name is empty', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })

      const playerData = {
        name: '',
        email: 'test@example.com',
        phone: '(11) 99999-9999',
        unitId: unit.id
      }

      await expect(playerService.create(playerData)).rejects.toThrow('Nome é obrigatório')
    })

    it('should throw AppError when email is not provided', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })

      const playerData = {
        name: 'Test Player',
        phone: '(11) 99999-9999',
        unitId: unit.id
      }

      await expect(playerService.create(playerData)).rejects.toThrow('Email é obrigatório')
    })

    it('should throw AppError when email is invalid', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })

      const playerData = {
        name: 'Test Player',
        email: 'invalid-email',
        phone: '(11) 99999-9999',
        unitId: unit.id
      }

      await expect(playerService.create(playerData)).rejects.toThrow('Email inválido')
    })
  })

  describe('findAll', () => {
    it('should return all players with their units', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      await Player.create({
        name: 'Test Player 1',
        email: 'test1@example.com',
        phone: '(11) 99999-9999',
        unitId: unit.id
      })
      await Player.create({
        name: 'Test Player 2',
        email: 'test2@example.com',
        phone: '(11) 99999-9998',
        unitId: unit.id
      })

      const players = await playerService.findAll()

      expect(players).toHaveLength(2)
      players.forEach((player) => {
        expect(player.toJSON()).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: expect.stringMatching(/Test Player [12]/),
            email: expect.stringMatching(/test[12]@example\.com/),
            phone: expect.stringMatching(/\(11\) 99999-999[89]/),
            unitId: unit.id,
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
    it('should return all players for a unit', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      await Player.create({
        name: 'Test Player 1',
        email: 'test1@example.com',
        phone: '(11) 99999-9999',
        unitId: unit.id
      })
      await Player.create({
        name: 'Test Player 2',
        email: 'test2@example.com',
        phone: '(11) 99999-9998',
        unitId: unit.id
      })

      const players = await playerService.findByUnit(unit.id)

      expect(players).toHaveLength(2)
      players.forEach((player) => {
        expect(player.toJSON()).toEqual(
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
      await expect(playerService.findByUnit('999999')).rejects.toThrow(AppError)
    })
  })

  describe('findById', () => {
    it('should return player by id with unit', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const player = await Player.create({
        name: 'Test Player',
        email: 'test@example.com',
        phone: '(11) 99999-9999',
        unitId: unit.id
      })

      const foundPlayer = await playerService.findById(player.id)

      expect(foundPlayer.toJSON()).toEqual(
        expect.objectContaining({
          id: player.id,
          name: player.name,
          email: player.email,
          phone: player.phone,
          unitId: unit.id,
          unit: expect.objectContaining({
            id: unit.id,
            name: unit.name
          })
        })
      )
    })

    it('should throw AppError when player does not exist', async () => {
      await expect(playerService.findById('999999')).rejects.toThrow(AppError)
    })
  })

  describe('update', () => {
    it('should update player', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const player = await Player.create({
        name: 'Test Player',
        email: 'test@example.com',
        phone: '(11) 99999-9999',
        unitId: unit.id
      })

      const updatedData = {
        name: 'Updated Player',
        email: 'updated@example.com'
      }

      const updatedPlayer = await playerService.update(player.id, updatedData)

      expect(updatedPlayer.toJSON()).toEqual(
        expect.objectContaining({
          id: player.id,
          name: updatedData.name,
          email: updatedData.email,
          phone: player.phone,
          unitId: unit.id
        })
      )
    })

    it('should throw AppError when player does not exist', async () => {
      await expect(playerService.update('999999', { name: 'Updated' })).rejects.toThrow(AppError)
    })

    it('should throw AppError when unit does not exist', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const player = await Player.create({
        name: 'Test Player',
        email: 'test@example.com',
        phone: '(11) 99999-9999',
        unitId: unit.id
      })

      await expect(playerService.update(player.id, { unitId: '999999' })).rejects.toThrow(AppError)
    })
  })

  describe('remove', () => {
    it('should remove player', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const player = await Player.create({
        name: 'Test Player',
        email: 'test@example.com',
        phone: '(11) 99999-9999',
        unitId: unit.id
      })

      await playerService.remove(player.id)

      const deletedPlayer = await Player.findByPk(player.id)
      expect(deletedPlayer).toBeNull()
    })

    it('should throw AppError when player does not exist', async () => {
      await expect(playerService.remove('999999')).rejects.toThrow(AppError)
    })
  })
})
