const {
  MatchParticipant,
  Match,
  Team,
  Player,
  Tournament,
  Unit,
  Institution,
  Event,
  Sport
} = require('@server/models')
const matchParticipantService = require('@server/services/matchParticipant.service')
const AppError = require('@server/utils/AppError')

describe('MatchParticipant Service', () => {
  describe('create', () => {
    it('should create a match participant with team', async () => {
      const sport = await Sport.create({
        name: 'Test Sport',
        description: 'Test Description'
      })

      const institution = await Institution.create({
        name: 'Test Institution',
        description: 'Test Description'
      })

      const unit = await Unit.create({
        name: 'Test Unit',
        description: 'Test Description',
        institutionId: institution.id
      })

      const event = await Event.create({
        name: 'Test Event',
        description: 'Test Description',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        unitId: unit.id
      })

      const tournament = await Tournament.create({
        name: 'Test Tournament',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        eventId: event.id
      })

      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date(),
        status: 'scheduled'
      })

      const team = await Team.create({
        name: 'Test Team',
        description: 'Test Description',
        unitId: unit.id,
        sportId: sport.id
      })

      const matchParticipantData = {
        matchId: match.id,
        participantType: 'team',
        teamId: team.id
      }

      const result = await matchParticipantService.create(matchParticipantData)

      expect(result.toJSON()).toEqual({
        id: expect.any(String),
        matchId: match.id,
        teamId: team.id,
        participantType: 'team',
        playerId: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    })

    it('should create a match participant with player', async () => {
      const sport = await Sport.create({
        name: 'Test Sport',
        description: 'Test Description'
      })

      const institution = await Institution.create({
        name: 'Test Institution',
        description: 'Test Description'
      })

      const unit = await Unit.create({
        name: 'Test Unit',
        description: 'Test Description',
        institutionId: institution.id
      })

      const event = await Event.create({
        name: 'Test Event',
        description: 'Test Description',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        unitId: unit.id
      })

      const tournament = await Tournament.create({
        name: 'Test Tournament',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        eventId: event.id
      })

      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date(),
        status: 'scheduled'
      })

      const player = await Player.create({
        name: 'Test Player',
        email: 'test@example.com',
        unitId: unit.id
      })

      const matchParticipantData = {
        matchId: match.id,
        participantType: 'player',
        playerId: player.id
      }

      const result = await matchParticipantService.create(matchParticipantData)

      expect(result.toJSON()).toEqual({
        id: expect.any(String),
        matchId: match.id,
        playerId: player.id,
        participantType: 'player',
        teamId: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    })

    it('should throw error if match does not exist', async () => {
      const sport = await Sport.create({
        name: 'Test Sport',
        description: 'Test Description'
      })

      const institution = await Institution.create({
        name: 'Test Institution',
        description: 'Test Description'
      })

      const unit = await Unit.create({
        name: 'Test Unit',
        description: 'Test Description',
        institutionId: institution.id
      })

      const team = await Team.create({
        name: 'Test Team',
        description: 'Test Description',
        unitId: unit.id,
        sportId: sport.id
      })

      const matchParticipantData = {
        matchId: 999,
        participantType: 'team',
        teamId: team.id
      }

      await expect(matchParticipantService.create(matchParticipantData)).rejects.toThrow(
        new AppError('Partida não encontrada', 404)
      )
    })

    it('should throw error if team does not exist', async () => {
      const institution = await Institution.create({
        name: 'Test Institution',
        description: 'Test Description'
      })

      const unit = await Unit.create({
        name: 'Test Unit',
        description: 'Test Description',
        institutionId: institution.id
      })

      const event = await Event.create({
        name: 'Test Event',
        description: 'Test Description',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        unitId: unit.id
      })

      const tournament = await Tournament.create({
        name: 'Test Tournament',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        eventId: event.id
      })

      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date(),
        status: 'scheduled'
      })

      const matchParticipantData = {
        matchId: match.id,
        participantType: 'team',
        teamId: 999
      }

      await expect(matchParticipantService.create(matchParticipantData)).rejects.toThrow(
        new AppError('Time não encontrado', 404)
      )
    })

    it('should throw error if player does not exist', async () => {
      const institution = await Institution.create({
        name: 'Test Institution',
        description: 'Test Description'
      })

      const unit = await Unit.create({
        name: 'Test Unit',
        description: 'Test Description',
        institutionId: institution.id
      })

      const event = await Event.create({
        name: 'Test Event',
        description: 'Test Description',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        unitId: unit.id
      })

      const tournament = await Tournament.create({
        name: 'Test Tournament',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        eventId: event.id
      })

      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date(),
        status: 'scheduled'
      })

      const matchParticipantData = {
        matchId: match.id,
        participantType: 'player',
        playerId: 999
      }

      await expect(matchParticipantService.create(matchParticipantData)).rejects.toThrow(
        new AppError('Jogador não encontrado', 404)
      )
    })
  })

  describe('findAll', () => {
    it('should return all match participants', async () => {
      const sport = await Sport.create({
        name: 'Test Sport',
        description: 'Test Description'
      })

      const institution = await Institution.create({
        name: 'Test Institution',
        description: 'Test Description'
      })

      const unit = await Unit.create({
        name: 'Test Unit',
        description: 'Test Description',
        institutionId: institution.id
      })

      const event = await Event.create({
        name: 'Test Event',
        description: 'Test Description',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        unitId: unit.id
      })

      const tournament = await Tournament.create({
        name: 'Test Tournament',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        eventId: event.id
      })

      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date(),
        status: 'scheduled'
      })

      const team = await Team.create({
        name: 'Test Team',
        description: 'Test Description',
        unitId: unit.id,
        sportId: sport.id
      })

      const matchParticipant = await MatchParticipant.create({
        matchId: match.id,
        participantType: 'team',
        teamId: team.id
      })

      const result = await matchParticipantService.findAll()

      expect(result.map((r) => r.toJSON())).toEqual([
        expect.objectContaining({
          id: matchParticipant.id,
          matchId: match.id,
          teamId: team.id,
          participantType: 'team',
          playerId: null,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      ])
    })
  })

  describe('findById', () => {
    it('should return match participant by id', async () => {
      const sport = await Sport.create({
        name: 'Test Sport',
        description: 'Test Description'
      })

      const institution = await Institution.create({
        name: 'Test Institution',
        description: 'Test Description'
      })

      const unit = await Unit.create({
        name: 'Test Unit',
        description: 'Test Description',
        institutionId: institution.id
      })

      const event = await Event.create({
        name: 'Test Event',
        description: 'Test Description',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        unitId: unit.id
      })

      const tournament = await Tournament.create({
        name: 'Test Tournament',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        eventId: event.id
      })

      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date(),
        status: 'scheduled'
      })

      const team = await Team.create({
        name: 'Test Team',
        description: 'Test Description',
        unitId: unit.id,
        sportId: sport.id
      })

      const matchParticipant = await MatchParticipant.create({
        matchId: match.id,
        participantType: 'team',
        teamId: team.id
      })

      const result = await matchParticipantService.findById(matchParticipant.id)

      expect(result.toJSON()).toEqual(
        expect.objectContaining({
          id: matchParticipant.id,
          matchId: match.id,
          teamId: team.id,
          participantType: 'team',
          playerId: null,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      )
    })

    it('should throw error if match participant not found', async () => {
      await expect(matchParticipantService.findById(999)).rejects.toThrow(
        new AppError('Participante não encontrado', 404)
      )
    })
  })

  describe('findByMatch', () => {
    it('should return match participants by match id', async () => {
      const sport = await Sport.create({
        name: 'Test Sport',
        description: 'Test Description'
      })

      const institution = await Institution.create({
        name: 'Test Institution',
        description: 'Test Description'
      })

      const unit = await Unit.create({
        name: 'Test Unit',
        description: 'Test Description',
        institutionId: institution.id
      })

      const event = await Event.create({
        name: 'Test Event',
        description: 'Test Description',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        unitId: unit.id
      })

      const tournament = await Tournament.create({
        name: 'Test Tournament',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        eventId: event.id
      })

      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date(),
        status: 'scheduled'
      })

      const team = await Team.create({
        name: 'Test Team',
        description: 'Test Description',
        unitId: unit.id,
        sportId: sport.id
      })

      const matchParticipant = await MatchParticipant.create({
        matchId: match.id,
        participantType: 'team',
        teamId: team.id
      })

      const result = await matchParticipantService.findByMatch(match.id)

      expect(result.map((r) => r.toJSON())).toEqual([
        expect.objectContaining({
          id: matchParticipant.id,
          matchId: match.id,
          teamId: team.id,
          participantType: 'team',
          playerId: null,
          team: expect.objectContaining({
            id: team.id,
            name: team.name,
            unitId: team.unitId,
            sportId: team.sportId,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          }),
          player: null,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      ])
    })

    it('should throw error if match not found', async () => {
      await expect(matchParticipantService.findByMatch(999)).rejects.toThrow(
        new AppError('Partida não encontrada', 404)
      )
    })
  })

  describe('findByTeam', () => {
    it('should return match participants by team id', async () => {
      const sport = await Sport.create({
        name: 'Test Sport',
        description: 'Test Description'
      })

      const institution = await Institution.create({
        name: 'Test Institution',
        description: 'Test Description'
      })

      const unit = await Unit.create({
        name: 'Test Unit',
        description: 'Test Description',
        institutionId: institution.id
      })

      const event = await Event.create({
        name: 'Test Event',
        description: 'Test Description',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        unitId: unit.id
      })

      const tournament = await Tournament.create({
        name: 'Test Tournament',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        eventId: event.id
      })

      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date(),
        status: 'scheduled'
      })

      const team = await Team.create({
        name: 'Test Team',
        description: 'Test Description',
        unitId: unit.id,
        sportId: sport.id
      })

      const matchParticipant = await MatchParticipant.create({
        matchId: match.id,
        participantType: 'team',
        teamId: team.id
      })

      const result = await matchParticipantService.findByTeam(team.id)

      expect(result.map((r) => r.toJSON())).toEqual([
        expect.objectContaining({
          id: matchParticipant.id,
          matchId: match.id,
          teamId: team.id,
          participantType: 'team',
          playerId: null,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      ])
    })

    it('should throw error if team not found', async () => {
      await expect(matchParticipantService.findByTeam(999)).rejects.toThrow(
        new AppError('Time não encontrado', 404)
      )
    })
  })

  describe('findByPlayer', () => {
    it('should return match participants by player id', async () => {
      const institution = await Institution.create({
        name: 'Test Institution',
        description: 'Test Description'
      })

      const unit = await Unit.create({
        name: 'Test Unit',
        description: 'Test Description',
        institutionId: institution.id
      })

      const event = await Event.create({
        name: 'Test Event',
        description: 'Test Description',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        unitId: unit.id
      })

      const tournament = await Tournament.create({
        name: 'Test Tournament',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        eventId: event.id
      })

      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date(),
        status: 'scheduled'
      })

      const player = await Player.create({
        name: 'Test Player',
        email: 'test@example.com',
        unitId: unit.id
      })

      const matchParticipant = await MatchParticipant.create({
        matchId: match.id,
        participantType: 'player',
        playerId: player.id
      })

      const result = await matchParticipantService.findByPlayer(player.id)

      expect(result.map((r) => r.toJSON())).toEqual([
        expect.objectContaining({
          id: matchParticipant.id,
          matchId: match.id,
          playerId: player.id,
          participantType: 'player',
          teamId: null,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      ])
    })

    it('should throw error if player not found', async () => {
      await expect(matchParticipantService.findByPlayer(999)).rejects.toThrow(
        new AppError('Jogador não encontrado', 404)
      )
    })
  })

  describe('update', () => {
    it('should update match participant', async () => {
      const sport = await Sport.create({
        name: 'Test Sport',
        description: 'Test Description'
      })

      const institution = await Institution.create({
        name: 'Test Institution',
        description: 'Test Description'
      })

      const unit = await Unit.create({
        name: 'Test Unit',
        description: 'Test Description',
        institutionId: institution.id
      })

      const event = await Event.create({
        name: 'Test Event',
        description: 'Test Description',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        unitId: unit.id
      })

      const tournament = await Tournament.create({
        name: 'Test Tournament',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        eventId: event.id
      })

      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date(),
        status: 'scheduled'
      })

      const team = await Team.create({
        name: 'Test Team',
        description: 'Test Description',
        unitId: unit.id,
        sportId: sport.id
      })

      const newTeam = await Team.create({
        name: 'New Team',
        description: 'New Description',
        unitId: unit.id,
        sportId: sport.id
      })

      const matchParticipant = await MatchParticipant.create({
        matchId: match.id,
        participantType: 'team',
        teamId: team.id
      })

      const result = await matchParticipantService.update(matchParticipant.id, {
        teamId: newTeam.id
      })

      expect(result.toJSON()).toEqual(
        expect.objectContaining({
          id: matchParticipant.id,
          matchId: match.id,
          teamId: newTeam.id,
          participantType: 'team',
          playerId: null,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      )
    })

    it('should throw error if match participant not found', async () => {
      await expect(matchParticipantService.update(999, { teamId: 1 })).rejects.toThrow(
        new AppError('Participante não encontrado', 404)
      )
    })

    it('should throw error if new team not found', async () => {
      const sport = await Sport.create({
        name: 'Test Sport',
        description: 'Test Description'
      })

      const institution = await Institution.create({
        name: 'Test Institution',
        description: 'Test Description'
      })

      const unit = await Unit.create({
        name: 'Test Unit',
        description: 'Test Description',
        institutionId: institution.id
      })

      const event = await Event.create({
        name: 'Test Event',
        description: 'Test Description',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        unitId: unit.id
      })

      const tournament = await Tournament.create({
        name: 'Test Tournament',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        eventId: event.id
      })

      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date(),
        status: 'scheduled'
      })

      const team = await Team.create({
        name: 'Test Team',
        description: 'Test Description',
        unitId: unit.id,
        sportId: sport.id
      })

      const matchParticipant = await MatchParticipant.create({
        matchId: match.id,
        participantType: 'team',
        teamId: team.id
      })

      await expect(
        matchParticipantService.update(matchParticipant.id, { teamId: 999 })
      ).rejects.toThrow(new AppError('Time não encontrado', 404))
    })
  })

  describe('remove', () => {
    it('should remove match participant', async () => {
      const sport = await Sport.create({
        name: 'Test Sport',
        description: 'Test Description'
      })

      const institution = await Institution.create({
        name: 'Test Institution',
        description: 'Test Description'
      })

      const unit = await Unit.create({
        name: 'Test Unit',
        description: 'Test Description',
        institutionId: institution.id
      })

      const event = await Event.create({
        name: 'Test Event',
        description: 'Test Description',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        unitId: unit.id
      })

      const tournament = await Tournament.create({
        name: 'Test Tournament',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        eventId: event.id
      })

      const match = await Match.create({
        tournamentId: tournament.id,
        date: new Date(),
        status: 'scheduled'
      })

      const team = await Team.create({
        name: 'Test Team',
        description: 'Test Description',
        unitId: unit.id,
        sportId: sport.id
      })

      const matchParticipant = await MatchParticipant.create({
        matchId: match.id,
        participantType: 'team',
        teamId: team.id
      })

      const result = await matchParticipantService.remove(matchParticipant.id)

      expect(result.toJSON()).toEqual(
        expect.objectContaining({
          id: matchParticipant.id,
          matchId: match.id,
          teamId: team.id,
          participantType: 'team',
          playerId: null,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      )

      const deleted = await MatchParticipant.findByPk(matchParticipant.id)
      expect(deleted).toBeNull()
    })

    it('should throw error if match participant not found', async () => {
      await expect(matchParticipantService.remove(999)).rejects.toThrow(
        new AppError('Participante não encontrado', 404)
      )
    })
  })

  describe('removeByMatch', () => {
    it('should remove all participants from a match', async () => {
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

      const sport = await Sport.create({
        name: 'Test Sport',
        description: 'Test Description'
      })

      const team = await Team.create({
        name: 'Test Team',
        description: 'Test Description',
        unitId: unit.id,
        sportId: sport.id
      })

      const player = await Player.create({
        name: 'Test Player',
        email: 'test@example.com',
        unitId: unit.id
      })

      await MatchParticipant.create({
        matchId: match.id,
        participantType: 'team',
        teamId: team.id
      })

      await MatchParticipant.create({
        matchId: match.id,
        participantType: 'player',
        playerId: player.id
      })

      await matchParticipantService.removeByMatch(match.id)

      const participants = await MatchParticipant.findAll({
        where: { matchId: match.id }
      })

      expect(participants).toHaveLength(0)
    })

    it('should throw AppError when match does not exist', async () => {
      await expect(matchParticipantService.removeByMatch('999999')).rejects.toThrow(
        'Partida não encontrada'
      )
    })
  })

  describe('bulkCreate', () => {
    it('should create multiple participants for a match', async () => {
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

      const sport = await Sport.create({
        name: 'Test Sport',
        description: 'Test Description'
      })

      const team = await Team.create({
        name: 'Test Team',
        description: 'Test Description',
        unitId: unit.id,
        sportId: sport.id
      })

      const player = await Player.create({
        name: 'Test Player',
        email: 'test@example.com',
        unitId: unit.id
      })

      const participantsData = [
        {
          matchId: match.id,
          participantType: 'team',
          teamId: team.id
        },
        {
          matchId: match.id,
          participantType: 'player',
          playerId: player.id
        }
      ]

      const participants = await matchParticipantService.bulkCreate(participantsData)

      expect(participants).toHaveLength(2)
      expect(participants[0].toJSON()).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          matchId: match.id,
          participantType: 'team',
          teamId: team.id,
          playerId: null,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      )
      expect(participants[1].toJSON()).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          matchId: match.id,
          participantType: 'player',
          teamId: null,
          playerId: player.id,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      )
    })

    it('should throw AppError when match does not exist', async () => {
      const participantsData = [
        {
          matchId: '999999',
          participantType: 'team',
          teamId: '1'
        }
      ]

      await expect(matchParticipantService.bulkCreate(participantsData)).rejects.toThrow(
        'Partida não encontrada'
      )
    })

    it('should throw AppError when team does not exist', async () => {
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

      const participantsData = [
        {
          matchId: match.id,
          participantType: 'team',
          teamId: '999999'
        }
      ]

      await expect(matchParticipantService.bulkCreate(participantsData)).rejects.toThrow(
        'Time não encontrado'
      )
    })

    it('should throw AppError when player does not exist', async () => {
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

      const participantsData = [
        {
          matchId: match.id,
          participantType: 'player',
          playerId: '999999'
        }
      ]

      await expect(matchParticipantService.bulkCreate(participantsData)).rejects.toThrow(
        'Jogador não encontrado'
      )
    })
  })
})
