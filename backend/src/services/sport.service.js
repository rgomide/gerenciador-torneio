const { Sport } = require('@server/models')
const AppError = require('@server/utils/AppError')

const validateName = (name) => {
  if (!name) {
    throw new AppError('Nome é obrigatório', 400)
  }
  if (name.trim() === '') {
    throw new AppError('Nome não pode estar vazio', 400)
  }
}

const create = async (sportData) => {
  validateName(sportData.name)

  return Sport.create(sportData)
}

const findAll = async () => {
  return Sport.findAll()
}

const findById = async (id) => {
  const sport = await Sport.findByPk(id)

  if (!sport) {
    throw new AppError('Esporte não encontrado', 404)
  }

  return sport
}

const update = async (id, sportData) => {
  validateName(sportData.name)

  const sport = await Sport.findByPk(id)
  if (!sport) {
    throw new AppError('Esporte não encontrado', 404)
  }

  await sport.update(sportData)

  return findById(id)
}

const remove = async (id) => {
  const sport = await Sport.findByPk(id)
  if (!sport) {
    throw new AppError('Esporte não encontrado', 404)
  }

  await sport.destroy()
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove
}
