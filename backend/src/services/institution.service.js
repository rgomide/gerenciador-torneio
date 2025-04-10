const { Institution } = require('@server/models')
const AppError = require('@server/utils/AppError')

const validateName = (name) => {
  if (!name) {
    throw new AppError('Name is required', 400)
  }
  if (name.trim() === '') {
    throw new AppError('Name cannot be empty', 400)
  }
}

const create = async ({ name }) => {
  validateName(name)

  let institution = await Institution.findOne({ where: { name } })

  if (institution) {
    throw new AppError('Institution already exists', 400)
  }

  return await Institution.create({ name })
}

const findAll = async () => {
  return await Institution.findAll()
}

const findById = async (id) => {
  const institution = await Institution.findByPk(id)
  if (!institution) {
    throw new AppError('Institution not found', 404)
  }
  return institution
}

const update = async (id, data) => {
  validateName(data.name)

  const institution = await Institution.findByPk(id)
  if (!institution) {
    throw new AppError('Institution not found', 404)
  }
  return await institution.update(data)
}

const remove = async (id) => {
  const institution = await Institution.findByPk(id)

  if (!institution) {
    throw new AppError('Institution not found', 404)
  }

  await institution.destroy()

  return true
}

module.exports = { create, findAll, findById, update, remove }
