const { Event, Unit } = require('@server/models')
const AppError = require('@server/utils/AppError')

const create = async (eventData) => {
  const unit = await Unit.findByPk(eventData.unitId)
  if (!unit) {
    throw new AppError('Unit not found', 404)
  }

  return Event.create(eventData)
}

const findAll = async () => {
  return Event.findAll({
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
    throw new AppError('Unit not found', 404)
  }

  return Event.findAll({
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
  const event = await Event.findByPk(id, {
    include: [
      {
        model: Unit,
        as: 'unit'
      }
    ]
  })

  if (!event) {
    throw new AppError('Event not found', 404)
  }

  return event
}

const update = async (id, eventData) => {
  const event = await Event.findByPk(id)
  if (!event) {
    throw new AppError('Event not found', 404)
  }

  if (!eventData.unitId) {
    eventData.unitId = event.unitId
  }

  const unit = await Unit.findByPk(eventData.unitId)

  if (!unit) {
    throw new AppError('Unit not found', 404)
  }

  await event.update(eventData)

  return findById(id)
}

const remove = async (id) => {
  const event = await Event.findByPk(id)
  if (!event) {
    throw new AppError('Event not found', 404)
  }

  await event.destroy()
}

module.exports = {
  create,
  findAll,
  findByUnit,
  findById,
  update,
  remove
}
