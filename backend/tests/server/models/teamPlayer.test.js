const { TeamPlayer, Player, Team, Unit, Sport, Institution } = require('../../../src/models')

describe('TeamPlayer Model', () => {
  it('should create a team player relationship', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const sport = await Sport.create({
      name: 'Test Sport'
    })

    const player = await Player.create({
      name: 'Test Player',
      email: 'player@test.com',
      unitId: unit.id
    })

    const team = await Team.create({
      name: 'Test Team',
      sportId: sport.id,
      unitId: unit.id
    })

    const teamPlayer = await TeamPlayer.create({
      playerId: player.id,
      teamId: team.id,
      details: 'Starting player'
    })

    expect(teamPlayer.toJSON()).toEqual({
      playerId: player.id,
      teamId: team.id,
      details: 'Starting player',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it('should create a team player relationship without details', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const sport = await Sport.create({
      name: 'Test Sport'
    })

    const player = await Player.create({
      name: 'Test Player',
      email: 'player@test.com',
      unitId: unit.id
    })

    const team = await Team.create({
      name: 'Test Team',
      sportId: sport.id,
      unitId: unit.id
    })

    const teamPlayer = await TeamPlayer.create({
      playerId: player.id,
      teamId: team.id
    })

    expect(teamPlayer.toJSON()).toEqual({
      playerId: player.id,
      teamId: team.id,
      details: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it('should not allow duplicate player-team combinations', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const sport = await Sport.create({
      name: 'Test Sport'
    })

    const player = await Player.create({
      name: 'Test Player',
      email: 'player@test.com',
      unitId: unit.id
    })

    const team = await Team.create({
      name: 'Test Team',
      sportId: sport.id,
      unitId: unit.id
    })

    await TeamPlayer.create({
      playerId: player.id,
      teamId: team.id
    })

    await expect(
      TeamPlayer.create({
        playerId: player.id,
        teamId: team.id
      })
    ).rejects.toThrow()
  })

  it('should not allow null playerId', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const sport = await Sport.create({
      name: 'Test Sport'
    })

    const team = await Team.create({
      name: 'Test Team',
      sportId: sport.id,
      unitId: unit.id
    })

    await expect(
      TeamPlayer.create({
        teamId: team.id
      })
    ).rejects.toThrow()
  })

  it('should not allow null teamId', async () => {
    const institution = await Institution.create({
      name: 'Test Institution'
    })

    const unit = await Unit.create({
      name: 'Test Unit',
      institutionId: institution.id
    })

    const player = await Player.create({
      name: 'Test Player',
      email: 'player@test.com',
      unitId: unit.id
    })

    await expect(
      TeamPlayer.create({
        playerId: player.id
      })
    ).rejects.toThrow()
  })
})
