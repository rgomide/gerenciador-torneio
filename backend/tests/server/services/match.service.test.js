const matchService = require('@server/services/match.service')
const { Match, Tournament, Event, Unit, Institution } = require('@server/models')
const AppError = require('@server/utils/AppError')

describe('Match Service', () => {
  describe('create', () => {
    it('should create a match', async () => {
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

      const matchData = {
        tournamentId: tournament.id,
        date: new Date('2024-01-01T10:00:00'),
        location: 'Test Location',
        finished: false,
        occurrences: 'Test occurrences',
        roundNumber: 1
      }

      const match = await matchService.create(matchData)

      expect(match.toJSON()).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          tournamentId: tournament.id,
          date: matchData.date,
          location: matchData.location,
          finished: matchData.finished,
          occurrences: matchData.occurrences,
          roundNumber: matchData.roundNumber,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      )
    })

    it('should throw AppError when tournament does not exist', async () => {
      const matchData = {
        tournamentId: '999999',
        date: new Date('2024-01-01T10:00:00'),
        location: 'Test Location',
        finished: false,
        occurrences: 'Test occurrences',
        roundNumber: 1
      }

      await expect(matchService.create(matchData)).rejects.toThrow('Torneio não encontrado')
    })

    it('should throw AppError when date is not provided', async () => {
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

      const matchData = {
        tournamentId: tournament.id,
        location: 'Test Location',
        finished: false,
        occurrences: 'Test occurrences',
        roundNumber: 1
      }

      await expect(matchService.create(matchData)).rejects.toThrow('Data é obrigatória')
    })
  })

  describe('findAll', () => {
    it('should return all matches', async () => {
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

      await Match.create({
        tournamentId: tournament.id,
        date: new Date('2024-01-01T10:00:00'),
        location: 'Test Location 1',
        finished: false,
        occurrences: 'Test occurrences 1',
        roundNumber: 1
      })

      await Match.create({
        tournamentId: tournament.id,
        date: new Date('2024-01-01T14:00:00'),
        location: 'Test Location 2',
        finished: false,
        occurrences: 'Test occurrences 2',
        roundNumber: 2
      })

      const matches = await matchService.findAll()

      expect(matches).toHaveLength(2)
      matches.forEach((match) => {
        expect(match.toJSON()).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            tournamentId: tournament.id,
            date: expect.any(Date),
            location: expect.stringMatching(/Test Location [12]/),
            finished: false,
            occurrences: expect.stringMatching(/Test occurrences [12]/),
            roundNumber: expect.any(Number),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          })
        )
      })
    })
  })

  describe('findByTournament', () => {
    it('should return all matches for a tournament', async () => {
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

      await Match.create({
        tournamentId: tournament.id,
        date: new Date('2024-01-01T10:00:00'),
        location: 'Test Location 1',
        finished: false,
        occurrences: 'Test occurrences 1',
        roundNumber: 1
      })

      await Match.create({
        tournamentId: tournament.id,
        date: new Date('2024-01-01T14:00:00'),
        location: 'Test Location 2',
        finished: false,
        occurrences: 'Test occurrences 2',
        roundNumber: 2
      })

      const matches = await matchService.findByTournament(tournament.id)

      expect(matches).toHaveLength(2)
      matches.forEach((match) => {
        expect(match.toJSON()).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            tournamentId: tournament.id,
            date: expect.any(Date),
            location: expect.stringMatching(/Test Location [12]/),
            finished: false,
            occurrences: expect.stringMatching(/Test occurrences [12]/),
            roundNumber: expect.any(Number),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          })
        )
      })
    })

    it('should throw AppError when tournament does not exist', async () => {
      await expect(matchService.findByTournament('999999')).rejects.toThrow(
        'Torneio não encontrado'
      )
    })
  })

  describe('findById', () => {
    it('should return match by id', async () => {
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

      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date('2024-01-01T10:00:00'),
        location: 'Test Location',
        finished: false,
        occurrences: 'Test occurrences',
        roundNumber: 1
      })

      const foundMatch = await matchService.findById(match.id)

      expect(foundMatch.toJSON()).toEqual(
        expect.objectContaining({
          id: match.id,
          tournamentId: tournament.id,
          date: match.date,
          location: match.location,
          finished: match.finished,
          occurrences: match.occurrences,
          roundNumber: match.roundNumber
        })
      )
    })

    it('should throw AppError when match does not exist', async () => {
      await expect(matchService.findById('999999')).rejects.toThrow('Partida não encontrada')
    })
  })

  describe('update', () => {
    it('should update match', async () => {
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

      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date('2024-01-01T10:00:00'),
        location: 'Test Location',
        finished: false,
        occurrences: 'Test occurrences',
        roundNumber: 1
      })

      const updatedData = {
        location: 'Updated Location',
        finished: true,
        occurrences: 'Updated occurrences',
        roundNumber: 2
      }

      const updatedMatch = await matchService.update(match.id, updatedData)

      expect(updatedMatch.toJSON()).toEqual(
        expect.objectContaining({
          id: match.id,
          tournamentId: tournament.id,
          date: match.date,
          location: updatedData.location,
          finished: updatedData.finished,
          occurrences: updatedData.occurrences,
          roundNumber: updatedData.roundNumber
        })
      )
    })

    it('should throw AppError when match does not exist', async () => {
      const updatedData = {
        location: 'Updated Location',
        finished: true,
        occurrences: 'Updated occurrences',
        roundNumber: 2
      }

      await expect(matchService.update('999999', updatedData)).rejects.toThrow(
        'Partida não encontrada'
      )
    })

    it('should throw AppError when tournament does not exist', async () => {
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

      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date('2024-01-01T10:00:00'),
        location: 'Test Location',
        finished: false,
        occurrences: 'Test occurrences',
        roundNumber: 1
      })

      const updatedData = {
        tournamentId: '999999',
        location: 'Updated Location',
        finished: true,
        occurrences: 'Updated occurrences',
        roundNumber: 2
      }

      await expect(matchService.update(match.id, updatedData)).rejects.toThrow(
        'Torneio não encontrado'
      )
    })
  })

  describe('remove', () => {
    it('should delete match', async () => {
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

      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date('2024-01-01T10:00:00'),
        location: 'Test Location',
        finished: false,
        occurrences: 'Test occurrences',
        roundNumber: 1
      })

      await matchService.remove(match.id)

      const foundMatch = await Match.findByPk(match.id)
      expect(foundMatch).toBeNull()
    })

    it('should throw AppError when match does not exist', async () => {
      await expect(matchService.remove('999999')).rejects.toThrow('Partida não encontrada')
    })
  })
})
