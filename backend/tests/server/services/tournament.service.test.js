const tournamentService = require('@server/services/tournament.service')
const { Tournament, Event, Unit, Institution } = require('@server/models')
const AppError = require('@server/utils/AppError')

describe('Tournament Service', () => {
  describe('create', () => {
    it('should create a tournament', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const tournamentData = {
        name: 'Test Tournament',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      }

      const tournament = await tournamentService.create(tournamentData)

      expect(tournament.toJSON()).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: tournamentData.name,
          eventId: event.id,
          startDate: tournamentData.startDate,
          endDate: tournamentData.endDate,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      )
    })

    it('should throw AppError when event does not exist', async () => {
      const tournamentData = {
        name: 'Test Tournament',
        eventId: '999999',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      }

      await expect(tournamentService.create(tournamentData)).rejects.toThrow(
        'Evento não encontrado'
      )
    })

    it('should throw AppError when name is not provided', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const tournamentData = {
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      }

      await expect(tournamentService.create(tournamentData)).rejects.toThrow('Nome é obrigatório')
    })

    it('should throw AppError when name is empty', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const tournamentData = {
        name: '',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      }

      await expect(tournamentService.create(tournamentData)).rejects.toThrow('Nome é obrigatório')
    })

    it('should throw AppError when name is only whitespace', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const tournamentData = {
        name: '   ',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      }

      await expect(tournamentService.create(tournamentData)).rejects.toThrow(
        'Nome não pode estar vazio'
      )
    })

    it('should throw AppError when start date is not provided', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const tournamentData = {
        name: 'Test Tournament',
        eventId: event.id,
        endDate: new Date('2024-01-02')
      }

      await expect(tournamentService.create(tournamentData)).rejects.toThrow(
        'Data de início é obrigatória'
      )
    })

    it('should throw AppError when end date is not provided', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const tournamentData = {
        name: 'Test Tournament',
        eventId: event.id,
        startDate: new Date('2024-01-01')
      }

      await expect(tournamentService.create(tournamentData)).rejects.toThrow(
        'Data de término é obrigatória'
      )
    })

    it('should throw AppError when start date is after end date', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const tournamentData = {
        name: 'Test Tournament',
        eventId: event.id,
        startDate: new Date('2024-01-02'),
        endDate: new Date('2024-01-01')
      }

      await expect(tournamentService.create(tournamentData)).rejects.toThrow(
        'Data de início não pode ser posterior à data de término'
      )
    })
  })

  describe('findAll', () => {
    it('should return all tournaments with their events', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      await Tournament.create({
        name: 'Test Tournament 1',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      await Tournament.create({
        name: 'Test Tournament 2',
        eventId: event.id,
        startDate: new Date('2024-01-03'),
        endDate: new Date('2024-01-04')
      })

      const tournaments = await tournamentService.findAll()

      expect(tournaments).toHaveLength(2)
      tournaments.forEach((tournament) => {
        expect(tournament.toJSON()).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: expect.stringMatching(/Test Tournament [12]/),
            eventId: event.id,
            startDate: expect.any(Date),
            endDate: expect.any(Date),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            event: expect.objectContaining({
              id: event.id,
              name: event.name
            })
          })
        )
      })
    })
  })

  describe('findByEvent', () => {
    it('should return all tournaments for an event', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      await Tournament.create({
        name: 'Test Tournament 1',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      await Tournament.create({
        name: 'Test Tournament 2',
        eventId: event.id,
        startDate: new Date('2024-01-03'),
        endDate: new Date('2024-01-04')
      })

      const tournaments = await tournamentService.findByEvent(event.id)

      expect(tournaments).toHaveLength(2)
      tournaments.forEach((tournament) => {
        expect(tournament.toJSON()).toEqual(
          expect.objectContaining({
            eventId: event.id,
            event: expect.objectContaining({
              id: event.id,
              name: event.name
            })
          })
        )
      })
    })

    it('should throw AppError when event does not exist', async () => {
      await expect(tournamentService.findByEvent('999999')).rejects.toThrow(AppError)
    })
  })

  describe('findById', () => {
    it('should return tournament by id with event', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
        name: 'Test Tournament',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const foundTournament = await tournamentService.findById(tournament.id)

      expect(foundTournament.toJSON()).toEqual(
        expect.objectContaining({
          id: tournament.id,
          name: tournament.name,
          eventId: event.id,
          startDate: tournament.startDate,
          endDate: tournament.endDate,
          event: expect.objectContaining({
            id: event.id,
            name: event.name
          })
        })
      )
    })

    it('should throw AppError when tournament does not exist', async () => {
      await expect(tournamentService.findById('999999')).rejects.toThrow(AppError)
    })
  })

  describe('update', () => {
    it('should update tournament', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
        name: 'Test Tournament',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      const updatedData = {
        name: 'Updated Tournament',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-02')
      }

      const updatedTournament = await tournamentService.update(tournament.id, updatedData)

      expect(updatedTournament.toJSON()).toEqual(
        expect.objectContaining({
          id: tournament.id,
          name: updatedData.name,
          eventId: event.id,
          startDate: updatedData.startDate,
          endDate: updatedData.endDate,
          event: expect.objectContaining({
            id: event.id,
            name: event.name
          })
        })
      )
    })

    it('should throw AppError when tournament does not exist', async () => {
      await expect(
        tournamentService.update('999999', {
          name: 'Updated Tournament',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-02')
        })
      ).rejects.toThrow('Torneio não encontrado')
    })

    it('should throw AppError when updating to non-existent event', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
        name: 'Test Tournament',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      await expect(
        tournamentService.update(tournament.id, {
          eventId: '999999',
          name: 'Updated Tournament',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-02')
        })
      ).rejects.toThrow('Evento não encontrado')
    })

    it('should throw AppError when name is empty', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
        name: 'Test Tournament',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      await expect(tournamentService.update(tournament.id, { name: '' })).rejects.toThrow(
        'Nome é obrigatório'
      )
    })

    it('should throw AppError when name is only whitespace', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
        name: 'Test Tournament',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      await expect(tournamentService.update(tournament.id, { name: '   ' })).rejects.toThrow(
        'Nome não pode estar vazio'
      )
    })

    it('should throw AppError when start date is after end date', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
        name: 'Test Tournament',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      await expect(
        tournamentService.update(tournament.id, {
          name: 'Updated Tournament',
          startDate: new Date('2024-01-03'),
          endDate: new Date('2024-01-02')
        })
      ).rejects.toThrow('Data de início não pode ser posterior à data de término')
    })
  })

  describe('remove', () => {
    it('should remove tournament', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const event = await Event.create({
        name: 'Test Event',
        unitId: unit.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })
      const tournament = await Tournament.create({
        name: 'Test Tournament',
        eventId: event.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      })

      await tournamentService.remove(tournament.id)

      const foundTournament = await Tournament.findByPk(tournament.id)
      expect(foundTournament).toBeNull()
    })

    it('should throw AppError when tournament does not exist', async () => {
      await expect(tournamentService.remove('999999')).rejects.toThrow(AppError)
    })
  })
})
