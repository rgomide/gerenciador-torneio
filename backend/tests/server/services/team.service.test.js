const teamService = require('@server/services/team.service')
const { Team, Unit, Sport, Institution } = require('@server/models')
const AppError = require('@server/utils/AppError')

describe('Team Service', () => {
  describe('create', () => {
    it('should create a team', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Futebol' })

      const teamData = {
        name: 'Time A',
        unitId: unit.id,
        sportId: sport.id
      }

      const team = await teamService.create(teamData)

      expect(team.toJSON()).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: teamData.name,
          unitId: unit.id,
          sportId: sport.id,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      )
    })

    it('should throw AppError when unit does not exist', async () => {
      const sport = await Sport.create({ name: 'Futebol' })
      const teamData = {
        name: 'Time A',
        unitId: '999999',
        sportId: sport.id
      }

      await expect(teamService.create(teamData)).rejects.toThrow('Unidade não encontrada')
    })

    it('should throw AppError when sport does not exist', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const teamData = {
        name: 'Time A',
        unitId: unit.id,
        sportId: '999999'
      }

      await expect(teamService.create(teamData)).rejects.toThrow('Esporte não encontrado')
    })

    it('should throw AppError when name is not provided', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Futebol' })
      const teamData = {
        unitId: unit.id,
        sportId: sport.id
      }

      await expect(teamService.create(teamData)).rejects.toThrow('Nome é obrigatório')
    })

    it('should throw AppError when name is empty', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Futebol' })
      const teamData = {
        name: '',
        unitId: unit.id,
        sportId: sport.id
      }

      await expect(teamService.create(teamData)).rejects.toThrow('Nome é obrigatório')
    })
  })

  describe('findAll', () => {
    it('should return all teams with their units and sports', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Futebol' })
      const team1 = await Team.create({
        name: 'Time A',
        unitId: unit.id,
        sportId: sport.id
      })
      const team2 = await Team.create({
        name: 'Time B',
        unitId: unit.id,
        sportId: sport.id
      })

      const teams = await teamService.findAll()

      expect(teams).toHaveLength(2)
      teams.forEach((team) => {
        expect(team.toJSON()).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: expect.stringMatching(/Time [AB]/),
            unitId: unit.id,
            sportId: sport.id,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            unit: expect.objectContaining({
              id: unit.id,
              name: unit.name
            }),
            sport: expect.objectContaining({
              id: sport.id,
              name: sport.name
            })
          })
        )
      })
    })
  })

  describe('findByUnit', () => {
    it('should return all teams for a unit', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Futebol' })
      const team1 = await Team.create({
        name: 'Time A',
        unitId: unit.id,
        sportId: sport.id
      })
      const team2 = await Team.create({
        name: 'Time B',
        unitId: unit.id,
        sportId: sport.id
      })

      const teams = await teamService.findByUnit(unit.id)

      expect(teams).toHaveLength(2)
      teams.forEach((team) => {
        expect(team.toJSON()).toEqual(
          expect.objectContaining({
            unitId: unit.id,
            sport: expect.objectContaining({
              id: sport.id,
              name: sport.name
            })
          })
        )
      })
    })

    it('should throw AppError when unit does not exist', async () => {
      await expect(teamService.findByUnit('999999')).rejects.toThrow('Unidade não encontrada')
    })
  })

  describe('findBySport', () => {
    it('should return all teams for a sport', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Futebol' })
      const team1 = await Team.create({
        name: 'Time A',
        unitId: unit.id,
        sportId: sport.id
      })
      const team2 = await Team.create({
        name: 'Time B',
        unitId: unit.id,
        sportId: sport.id
      })

      const teams = await teamService.findBySport(sport.id)

      expect(teams).toHaveLength(2)
      teams.forEach((team) => {
        expect(team.toJSON()).toEqual(
          expect.objectContaining({
            sportId: sport.id,
            unit: expect.objectContaining({
              id: unit.id,
              name: unit.name
            })
          })
        )
      })
    })

    it('should throw AppError when sport does not exist', async () => {
      await expect(teamService.findBySport('999999')).rejects.toThrow('Esporte não encontrado')
    })
  })

  describe('findById', () => {
    it('should return team by id with unit and sport', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({
        name: 'Time A',
        unitId: unit.id,
        sportId: sport.id
      })

      const foundTeam = await teamService.findById(team.id)

      expect(foundTeam.toJSON()).toEqual(
        expect.objectContaining({
          id: team.id,
          name: team.name,
          unitId: unit.id,
          sportId: sport.id,
          unit: expect.objectContaining({
            id: unit.id,
            name: unit.name
          }),
          sport: expect.objectContaining({
            id: sport.id,
            name: sport.name
          })
        })
      )
    })

    it('should throw AppError when team does not exist', async () => {
      await expect(teamService.findById('999999')).rejects.toThrow('Time não encontrado')
    })
  })

  describe('update', () => {
    it('should update team', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({
        name: 'Time A',
        unitId: unit.id,
        sportId: sport.id
      })

      const updatedData = {
        name: 'Time B'
      }

      const updatedTeam = await teamService.update(team.id, updatedData)

      expect(updatedTeam.toJSON()).toEqual(
        expect.objectContaining({
          id: team.id,
          name: updatedData.name,
          unitId: unit.id,
          sportId: sport.id
        })
      )
    })

    it('should throw AppError when team does not exist', async () => {
      await expect(teamService.update('999999', { name: 'Time B' })).rejects.toThrow(
        'Time não encontrado'
      )
    })

    it('should throw AppError when unit does not exist', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({
        name: 'Time A',
        unitId: unit.id,
        sportId: sport.id
      })

      await expect(teamService.update(team.id, { unitId: '999999' })).rejects.toThrow(
        'Unidade não encontrada'
      )
    })

    it('should throw AppError when sport does not exist', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({
        name: 'Time A',
        unitId: unit.id,
        sportId: sport.id
      })

      await expect(teamService.update(team.id, { sportId: '999999' })).rejects.toThrow(
        'Esporte não encontrado'
      )
    })
  })

  describe('remove', () => {
    it('should remove team', async () => {
      const institution = await Institution.create({ name: 'Test Institution' })
      const unit = await Unit.create({ name: 'Test Unit', institutionId: institution.id })
      const sport = await Sport.create({ name: 'Futebol' })
      const team = await Team.create({
        name: 'Time A',
        unitId: unit.id,
        sportId: sport.id
      })

      await teamService.remove(team.id)

      const foundTeam = await Team.findByPk(team.id)
      expect(foundTeam).toBeNull()
    })

    it('should throw AppError when team does not exist', async () => {
      await expect(teamService.remove('999999')).rejects.toThrow('Time não encontrado')
    })
  })
})
