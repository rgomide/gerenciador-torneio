const { TeamPlayer, Team, Player, Unit, Sport, Institution } = require('@server/models')
const teamPlayerService = require('@server/services/teamPlayer.service')

describe('TeamPlayer Service', () => {
  describe('create', () => {
    it('should create a new team-player relationship', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Test Sport' })
      const team = await Team.create({ name: 'Test Team', unitId: unit.id, sportId: sport.id })
      const player = await Player.create({
        name: 'Test Player',
        email: 'test@test.com',
        unitId: unit.id
      })

      const teamPlayerData = {
        teamId: team.id,
        playerId: player.id
      }

      const result = await teamPlayerService.create(teamPlayerData)

      expect(result).toEqual(
        expect.objectContaining({
          teamId: team.id,
          playerId: player.id
        })
      )
    })

    it('should throw error when team does not exist', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const player = await Player.create({
        name: 'Test Player',
        email: 'test@test.com',
        unitId: unit.id
      })

      const teamPlayerData = {
        teamId: 999,
        playerId: player.id
      }

      await expect(teamPlayerService.create(teamPlayerData)).rejects.toThrow('Time não encontrado')
    })

    it('should throw error when player does not exist', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Test Sport' })
      const team = await Team.create({ name: 'Test Team', unitId: unit.id, sportId: sport.id })

      const teamPlayerData = {
        teamId: team.id,
        playerId: 999
      }

      await expect(teamPlayerService.create(teamPlayerData)).rejects.toThrow(
        'Jogador não encontrado'
      )
    })

    it('should throw error when relationship already exists', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Test Sport' })
      const team = await Team.create({ name: 'Test Team', unitId: unit.id, sportId: sport.id })
      const player = await Player.create({
        name: 'Test Player',
        email: 'test@test.com',
        unitId: unit.id
      })

      const teamPlayerData = {
        teamId: team.id,
        playerId: player.id
      }

      await teamPlayerService.create(teamPlayerData)
      await expect(teamPlayerService.create(teamPlayerData)).rejects.toThrow(
        'Jogador já está no time'
      )
    })
  })

  describe('findAll', () => {
    it('should return all team-player relationships', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Test Sport' })
      const team = await Team.create({ name: 'Test Team', unitId: unit.id, sportId: sport.id })
      const player = await Player.create({
        name: 'Test Player',
        email: 'test@test.com',
        unitId: unit.id
      })
      await teamPlayerService.create({ teamId: team.id, playerId: player.id })

      const result = await teamPlayerService.findAll()

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            teamId: team.id,
            playerId: player.id
          })
        ])
      )
    })
  })

  describe('findById', () => {
    it('should return a team-player relationship by team and player ids', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Test Sport' })
      const team = await Team.create({ name: 'Test Team', unitId: unit.id, sportId: sport.id })
      const player = await Player.create({
        name: 'Test Player',
        email: 'test@test.com',
        unitId: unit.id
      })
      await teamPlayerService.create({ teamId: team.id, playerId: player.id })

      const result = await teamPlayerService.findById(team.id, player.id)

      expect(result).toEqual(
        expect.objectContaining({
          teamId: team.id,
          playerId: player.id
        })
      )
    })

    it('should throw error when relationship does not exist', async () => {
      await expect(teamPlayerService.findById(999, 999)).rejects.toThrow(
        'Relação time-jogador não encontrada'
      )
    })
  })

  describe('findByTeam', () => {
    it('should return all players in a team', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Test Sport' })
      const team = await Team.create({ name: 'Test Team', unitId: unit.id, sportId: sport.id })
      const player1 = await Player.create({
        name: 'Player 1',
        email: 'player1@test.com',
        unitId: unit.id
      })
      const player2 = await Player.create({
        name: 'Player 2',
        email: 'player2@test.com',
        unitId: unit.id
      })

      await teamPlayerService.create({ teamId: team.id, playerId: player1.id })
      await teamPlayerService.create({ teamId: team.id, playerId: player2.id })

      const result = await teamPlayerService.findByTeam(team.id)

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            teamId: team.id,
            playerId: player1.id
          }),
          expect.objectContaining({
            teamId: team.id,
            playerId: player2.id
          })
        ])
      )
    })

    it('should throw error when team does not exist', async () => {
      await expect(teamPlayerService.findByTeam(999)).rejects.toThrow('Time não encontrado')
    })
  })

  describe('findByPlayer', () => {
    it('should return all teams a player belongs to', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Test Sport' })
      const team1 = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })
      const team2 = await Team.create({ name: 'Team 2', unitId: unit.id, sportId: sport.id })
      const player = await Player.create({
        name: 'Test Player',
        email: 'test@test.com',
        unitId: unit.id
      })

      await teamPlayerService.create({ teamId: team1.id, playerId: player.id })
      await teamPlayerService.create({ teamId: team2.id, playerId: player.id })

      const result = await teamPlayerService.findByPlayer(player.id)

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            teamId: team1.id,
            playerId: player.id
          }),
          expect.objectContaining({
            teamId: team2.id,
            playerId: player.id
          })
        ])
      )
    })

    it('should throw error when player does not exist', async () => {
      await expect(teamPlayerService.findByPlayer(999)).rejects.toThrow('Jogador não encontrado')
    })
  })

  describe('update', () => {
    it('should update a details field', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Test Sport' })
      const team1 = await Team.create({ name: 'Team 1', unitId: unit.id, sportId: sport.id })
      const player = await Player.create({
        name: 'Test Player',
        email: 'test@test.com',
        unitId: unit.id
      })
      await teamPlayerService.create({ teamId: team1.id, playerId: player.id })

      const result = await teamPlayerService.update(team1.id, player.id, {
        details: 'Test Details'
      })

      expect(result).toEqual(
        expect.objectContaining({
          teamId: team1.id,
          playerId: player.id,
          details: 'Test Details'
        })
      )
    })

    it('should throw error when relationship does not exist', async () => {
      await expect(teamPlayerService.update(999, 999, { teamId: 1 })).rejects.toThrow(
        'Relação time-jogador não encontrada'
      )
    })

    it('should throw error when new team does not exist', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Test Sport' })
      const team = await Team.create({ name: 'Test Team', unitId: unit.id, sportId: sport.id })
      const player = await Player.create({
        name: 'Test Player',
        email: 'test@test.com',
        unitId: unit.id
      })
      await teamPlayerService.create({ teamId: team.id, playerId: player.id })

      await expect(teamPlayerService.update(team.id, player.id, { teamId: 999 })).rejects.toThrow(
        'Time não encontrado'
      )
    })

    it('should throw error when new player does not exist', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Test Sport' })
      const team = await Team.create({ name: 'Test Team', unitId: unit.id, sportId: sport.id })
      const player = await Player.create({
        name: 'Test Player',
        email: 'test@test.com',
        unitId: unit.id
      })
      await teamPlayerService.create({ teamId: team.id, playerId: player.id })

      await expect(teamPlayerService.update(team.id, player.id, { playerId: 999 })).rejects.toThrow(
        'Jogador não encontrado'
      )
    })
  })

  describe('remove', () => {
    it('should remove a team-player relationship', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Test Sport' })
      const team = await Team.create({ name: 'Test Team', unitId: unit.id, sportId: sport.id })
      const player = await Player.create({
        name: 'Test Player',
        email: 'test@test.com',
        unitId: unit.id
      })
      await teamPlayerService.create({ teamId: team.id, playerId: player.id })

      await teamPlayerService.remove(team.id, player.id)

      const result = await TeamPlayer.findOne({
        where: {
          teamId: team.id,
          playerId: player.id
        }
      })
      expect(result).toBeNull()
    })

    it('should throw error when relationship does not exist', async () => {
      await expect(teamPlayerService.remove(999, 999)).rejects.toThrow(
        'Relação time-jogador não encontrada'
      )
    })
  })

  describe('removeByTeam', () => {
    it('should remove all team-player relationships for a team', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Test Sport' })
      const team = await Team.create({ name: 'Test Team', unitId: unit.id, sportId: sport.id })
      const team2 = await Team.create({ name: 'Test Team 2', unitId: unit.id, sportId: sport.id })
      const player1 = await Player.create({
        name: 'Player 1',
        email: 'player1@test.com',
        unitId: unit.id
      })
      const player2 = await Player.create({
        name: 'Player 2',
        email: 'player2@test.com',
        unitId: unit.id
      })

      await teamPlayerService.create({ teamId: team.id, playerId: player1.id })
      await teamPlayerService.create({ teamId: team.id, playerId: player2.id })
      await teamPlayerService.create({ teamId: team2.id, playerId: player1.id })
      await teamPlayerService.create({ teamId: team2.id, playerId: player2.id })

      await teamPlayerService.removeByTeam(team.id)

      const teamPlayers = await TeamPlayer.findAll({
        where: { teamId: team.id }
      })
      expect(teamPlayers).toHaveLength(0)
    })

    it('should throw error when team does not exist', async () => {
      await expect(teamPlayerService.removeByTeam(999)).rejects.toThrow('Time não encontrado')
    })
  })

  describe('bulkInsert', () => {
    it('should remove existing relationships and insert new ones in bulk', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Test Sport' })
      const team = await Team.create({ name: 'Test Team', unitId: unit.id, sportId: sport.id })
      const player1 = await Player.create({
        name: 'Player 1',
        email: 'player1@test.com',
        unitId: unit.id
      })
      const player2 = await Player.create({
        name: 'Player 2',
        email: 'player2@test.com',
        unitId: unit.id
      })

      // Create initial relationships
      await teamPlayerService.create({ teamId: team.id, playerId: player1.id, details: 'old details' })
      await teamPlayerService.create({ teamId: team.id, playerId: player2.id, details: 'old details' })

      // Bulk insert new relationships
      const players = [
        { id: player1.id, details: 'new details 1' },
        { id: player2.id, details: 'new details 2' }
      ]
      await teamPlayerService.bulkInsert(team.id, players)

      // Verify old relationships were removed and new ones were created
      const teamPlayers = await TeamPlayer.findAll({
        where: { teamId: team.id },
        order: [['playerId', 'ASC']]
      })

      expect(teamPlayers).toHaveLength(2)
      expect(teamPlayers[0]).toEqual(
        expect.objectContaining({
          teamId: team.id,
          playerId: player1.id,
          details: 'new details 1'
        })
      )
      expect(teamPlayers[1]).toEqual(
        expect.objectContaining({
          teamId: team.id,
          playerId: player2.id,
          details: 'new details 2'
        })
      )
    })

    it('should throw error when team does not exist', async () => {
      const players = [
        { id: 1, details: 'details' }
      ]
      await expect(teamPlayerService.bulkInsert(999, players)).rejects.toThrow('Time não encontrado')
    })

    it('should throw error when player does not exist', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Test Sport' })
      const team = await Team.create({ name: 'Test Team', unitId: unit.id, sportId: sport.id })

      const players = [
        { id: 999, details: 'details' }
      ]
      await expect(teamPlayerService.bulkInsert(team.id, players)).rejects.toThrow('Jogador não encontrado')
    })
  })
})
