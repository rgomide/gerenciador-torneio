const { Player, Unit } = require('@server/models')
const AppError = require('@server/utils/AppError')

const validateName = (name) => {
  if (!name) {
    throw new AppError('Nome é obrigatório', 400)
  }
  if (name.trim() === '') {
    throw new AppError('Nome não pode estar vazio', 400)
  }
}

const validateEmail = (email) => {
  if (!email) {
    throw new AppError('Email é obrigatório', 400)
  }
  if (!email.includes('@')) {
    throw new AppError('Email inválido', 400)
  }
}

const create = async (playerData) => {
  validateName(playerData.name)
  validateEmail(playerData.email)

  const unit = await Unit.findByPk(playerData.unitId)
  if (!unit) {
    throw new AppError('Unidade não encontrada', 404)
  }

  return Player.create(playerData)
}

const findAll = async () => {
  return Player.findAll({
    include: [
      {
        model: Unit,
        as: 'unit'
      }
    ]
  })
}

const findByUnit = async (unitId) => {
  const unit = await Unit.findByPk(unitId)
  if (!unit) {
    throw new AppError('Unidade não encontrada', 404)
  }

  return Player.findAll({
    where: { unit_id: unitId },
    include: [
      {
        model: Unit,
        as: 'unit'
      }
    ]
  })
}

const findById = async (id) => {
  const player = await Player.findByPk(id, {
    include: [
      {
        model: Unit,
        as: 'unit'
      }
    ]
  })

  if (!player) {
    throw new AppError('Jogador não encontrado', 404)
  }

  return player
}

const update = async (id, playerData) => {
  validateName(playerData.name)
  validateEmail(playerData.email)

  const player = await Player.findByPk(id)
  if (!player) {
    throw new AppError('Jogador não encontrado', 404)
  }

  if (!playerData.unitId) {
    playerData.unitId = player.unitId
  }

  const unit = await Unit.findByPk(playerData.unitId)
  if (!unit) {
    throw new AppError('Unidade não encontrada', 404)
  }

  await player.update(playerData)

  return findById(id)
}

const remove = async (id) => {
  const player = await Player.findByPk(id)
  if (!player) {
    throw new AppError('Jogador não encontrado', 404)
  }

  await player.destroy()
}

module.exports = {
  create,
  findAll,
  findByUnit,
  findById,
  update,
  remove
}
