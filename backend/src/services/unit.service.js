const { Unit, Institution } = require('@server/models')
const AppError = require('@server/utils/AppError')

const validateName = (name) => {
  if (!name) {
    throw new AppError('Nome é obrigatório', 400)
  }
  if (name.trim() === '') {
    throw new AppError('Nome não pode estar vazio', 400)
  }
}

const create = async ({ name, institutionId }) => {
  validateName(name)

  const institution = await Institution.findByPk(institutionId)
  if (!institution) {
    throw new AppError('Instituição não encontrada', 404)
  }

  let unit = await Unit.findOne({ where: { name, institutionId } })
  if (unit) {
    throw new AppError('Unidade já existe nesta instituição', 400)
  }

  return await Unit.create({ name, institutionId })
}

const findAll = async () => {
  return await Unit.findAll({
    include: [
      {
        model: Institution,
        as: 'institution'
      }
    ]
  })
}

const findById = async (id) => {
  const unit = await Unit.findByPk(id, {
    include: [
      {
        model: Institution,
        as: 'institution'
      }
    ]
  })
  if (!unit) {
    throw new AppError('Unidade não encontrada', 404)
  }
  return unit
}

const findByInstitution = async (institutionId) => {
  const institution = await Institution.findByPk(institutionId)
  if (!institution) {
    throw new AppError('Instituição não encontrada', 404)
  }

  return await Unit.findAll({
    where: { institutionId },
    include: [
      {
        model: Institution,
        as: 'institution'
      }
    ]
  })
}

const update = async (id, data) => {
  validateName(data.name)

  const unit = await Unit.findByPk(id)
  if (!unit) {
    throw new AppError('Unidade não encontrada', 404)
  }

  if (data.institutionId) {
    const institution = await Institution.findByPk(data.institutionId)
    if (!institution) {
      throw new AppError('Instituição não encontrada', 404)
    }
  }

  return await unit.update(data)
}

const remove = async (id) => {
  const unit = await Unit.findByPk(id)
  if (!unit) {
    throw new AppError('Unidade não encontrada', 404)
  }

  await unit.destroy()
  return true
}

module.exports = { create, findAll, findById, findByInstitution, update, remove }
