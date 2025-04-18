const {
  MatchScore,
  Match,
  Team,
  Player,
  Tournament,
  Event,
  Unit,
  Institution,
  Sport
} = require('@server/models')
const matchScoreService = require('@server/services/matchScore.service')

describe('MatchScore Service', () => {
  describe('create', () => {
    it('should create a team score', async () => {
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

      const scoreData = {
        matchId: match.id,
        participantType: 'team',
        teamId: team.id,
        score: 10,
        details: 'Test details'
      }

      const score = await matchScoreService.create(scoreData)

      expect(score.toJSON()).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          matchId: match.id,
          participantType: 'team',
          teamId: team.id,
          playerId: null,
          score: 10,
          details: 'Test details',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      )
    })

    it('should create a player score', async () => {
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

      const player = await Player.create({
        name: 'Test Player',
        email: 'test@example.com',
        unitId: unit.id
      })

      const scoreData = {
        matchId: match.id,
        participantType: 'player',
        playerId: player.id,
        score: 15,
        details: 'Test details'
      }

      const score = await matchScoreService.create(scoreData)

      expect(score.toJSON()).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          matchId: match.id,
          participantType: 'player',
          teamId: null,
          playerId: player.id,
          score: 15,
          details: 'Test details',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      )
    })

    it('should throw error when match does not exist', async () => {
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

      await match.destroy()

      const scoreData = {
        matchId: match.id,
        participantType: 'team',
        teamId: team.id,
        score: 10
      }

      await expect(matchScoreService.create(scoreData)).rejects.toThrow('Partida não encontrada')
    })

    it('should throw error when team does not exist', async () => {
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

      await team.destroy()

      const scoreData = {
        matchId: match.id,
        participantType: 'team',
        teamId: team.id,
        score: 10
      }

      await expect(matchScoreService.create(scoreData)).rejects.toThrow('Time não encontrado')
    })

    it('should throw error when player does not exist', async () => {
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

      const player = await Player.create({
        name: 'Test Player',
        email: 'test@example.com',
        unitId: unit.id
      })

      await player.destroy()

      const scoreData = {
        matchId: match.id,
        participantType: 'player',
        playerId: player.id,
        score: 10
      }

      await expect(matchScoreService.create(scoreData)).rejects.toThrow('Jogador não encontrado')
    })
  })

  describe('update', () => {
    it('should update a score', async () => {
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

      const score = await MatchScore.create({
        matchId: match.id,
        participantType: 'team',
        teamId: team.id,
        score: 10,
        details: 'Test details'
      })

      const updatedScore = await matchScoreService.update(score.id, {
        score: 20,
        details: 'Updated details'
      })

      expect(updatedScore.toJSON()).toEqual(
        expect.objectContaining({
          id: score.id,
          matchId: match.id,
          participantType: 'team',
          teamId: team.id,
          playerId: null,
          score: 20,
          details: 'Updated details',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      )
    })

    it('should throw error when score does not exist', async () => {
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

      const score = await MatchScore.create({
        matchId: match.id,
        participantType: 'team',
        teamId: team.id,
        score: 10
      })

      await score.destroy()

      await expect(matchScoreService.update(score.id, { score: 20 })).rejects.toThrow(
        'Pontuação não encontrada'
      )
    })
  })

  describe('remove', () => {
    it('should remove a score', async () => {
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

      const score = await MatchScore.create({
        matchId: match.id,
        participantType: 'team',
        teamId: team.id,
        score: 10,
        details: 'Test details'
      })

      await matchScoreService.remove(score.id)

      const deletedScore = await MatchScore.findByPk(score.id)
      expect(deletedScore).toBeNull()
    })

    it('should throw error when score does not exist', async () => {
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

      const score = await MatchScore.create({
        matchId: match.id,
        participantType: 'team',
        teamId: team.id,
        score: 10
      })

      await score.destroy()

      await expect(matchScoreService.remove(score.id)).rejects.toThrow('Pontuação não encontrada')
    })
  })

  describe('removeByMatch', () => {
    it('should remove all scores for a match', async () => {
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

      await MatchScore.create({
        matchId: match.id,
        participantType: 'team',
        teamId: team.id,
        score: 10
      })

      await MatchScore.create({
        matchId: match.id,
        participantType: 'player',
        playerId: player.id,
        score: 15
      })

      await matchScoreService.removeByMatch(match.id)

      const scores = await MatchScore.findAll({ where: { matchId: match.id } })
      expect(scores).toHaveLength(0)
    })

    it('should throw error when match does not exist', async () => {
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

      await match.destroy()

      await expect(matchScoreService.removeByMatch(match.id)).rejects.toThrow(
        'Partida não encontrada'
      )
    })
  })

  describe('bulkCreate', () => {
    it('should create multiple scores', async () => {
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

      const scoresData = [
        {
          matchId: match.id,
          participantType: 'team',
          teamId: team.id,
          score: 10
        },
        {
          matchId: match.id,
          participantType: 'player',
          playerId: player.id,
          score: 15
        }
      ]

      const scores = await matchScoreService.bulkCreate(scoresData)

      expect(scores).toHaveLength(2)
      expect(scores[0].toJSON()).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          matchId: match.id,
          participantType: 'team',
          teamId: team.id,
          playerId: null,
          score: 10,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      )
      expect(scores[1].toJSON()).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          matchId: match.id,
          participantType: 'player',
          teamId: null,
          playerId: player.id,
          score: 15,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      )
    })

    it('should throw error when no scores provided', async () => {
      await expect(matchScoreService.bulkCreate([])).rejects.toThrow('Nenhuma pontuação fornecida')
    })

    it('should throw error when match does not exist', async () => {
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

      await match.destroy()

      const scoresData = [
        {
          matchId: match.id,
          participantType: 'team',
          teamId: team.id,
          score: 10
        }
      ]

      await expect(matchScoreService.bulkCreate(scoresData)).rejects.toThrow(
        'Partida não encontrada'
      )
    })

    it('should throw error when team does not exist', async () => {
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

      await team.destroy()

      const scoresData = [
        {
          matchId: match.id,
          participantType: 'team',
          teamId: team.id,
          score: 10
        }
      ]

      await expect(matchScoreService.bulkCreate(scoresData)).rejects.toThrow('Time não encontrado')
    })

    it('should throw error when player does not exist', async () => {
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

      const player = await Player.create({
        name: 'Test Player',
        email: 'test@example.com',
        unitId: unit.id
      })

      await player.destroy()

      const scoresData = [
        {
          matchId: match.id,
          participantType: 'player',
          playerId: player.id,
          score: 10
        }
      ]

      await expect(matchScoreService.bulkCreate(scoresData)).rejects.toThrow(
        'Jogador não encontrado'
      )
    })
  })
})
