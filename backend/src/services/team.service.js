const { Team, Unit, Sport } = require('@server/models')
const AppError = require('@server/utils/AppError')

const validateName = (name) => {
  if (!name) {
    throw new AppError('Nome é obrigatório', 400)
  }
  if (name.trim() === '') {
    throw new AppError('Nome não pode estar vazio', 400)
  }
}

const create = async (teamData) => {
  const unit = await Unit.findByPk(teamData.unitId)
  if (!unit) {
    throw new AppError('Unidade não encontrada', 404)
  }

  const sport = await Sport.findByPk(teamData.sportId)
  if (!sport) {
    throw new AppError('Esporte não encontrado', 404)
  }

  validateName(teamData.name)

  return Team.create(teamData)
}

const findAll = async () => {
  return Team.findAll({
    include: [
      {
        model: Unit,
        as: 'unit'
      },
      {
        model: Sport,
        as: 'sport'
      }
    ]
  })
}

const findById = async (id) => {
  const team = await Team.findByPk(id, {
    include: [
      {
        model: Unit,
        as: 'unit'
      },
      {
        model: Sport,
        as: 'sport'
      }
    ]
  })

  if (!team) {
    throw new AppError('Time não encontrado', 404)
  }

  return team
}

const findByUnit = async (unitId) => {
  const unit = await Unit.findByPk(unitId)
  if (!unit) {
    throw new AppError('Unidade não encontrada', 404)
  }

  return Team.findAll({
    where: { unitId },
    include: [
      {
        model: Sport,
        as: 'sport'
      }
    ]
  })
}

const findBySport = async (sportId) => {
  const sport = await Sport.findByPk(sportId)
  if (!sport) {
    throw new AppError('Esporte não encontrado', 404)
  }

  return Team.findAll({
    where: { sportId },
    include: [
      {
        model: Unit,
        as: 'unit'
      }
    ]
  })
}

const update = async (id, teamData) => {
  const team = await Team.findByPk(id)
  if (!team) {
    throw new AppError('Time não encontrado', 404)
  }

  if (teamData.unitId) {
    const unit = await Unit.findByPk(teamData.unitId)
    if (!unit) {
      throw new AppError('Unidade não encontrada', 404)
    }
  }

  if (teamData.sportId) {
    const sport = await Sport.findByPk(teamData.sportId)
    if (!sport) {
      throw new AppError('Esporte não encontrado', 404)
    }
  }

  validateName(teamData.name)

  await team.update(teamData)

  return findById(id)
}

const remove = async (id) => {
  const team = await Team.findByPk(id)
  if (!team) {
    throw new AppError('Time não encontrado', 404)
  }

  await team.destroy()
}

module.exports = {
  create,
  findAll,
  findById,
  findByUnit,
  findBySport,
  update,
  remove
}
