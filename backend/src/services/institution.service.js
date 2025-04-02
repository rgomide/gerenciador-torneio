const { Institution } = require('@server/models')
const AppError = require('@server/utils/AppError')

const create = async ({ name }) => {
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