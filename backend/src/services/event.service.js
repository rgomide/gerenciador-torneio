const { Event, Unit } = require('@server/models')
const AppError = require('@server/utils/AppError')

const validateName = (name) => {
  if (!name) {
    throw new AppError('Name is required', 400)
  }
  if (name.trim() === '') {
    throw new AppError('Name cannot be empty', 400)
  }
}

const validateDates = (startDate, endDate) => {
  if (!startDate) {
    throw new AppError('Start date is required', 400)
  }
  if (!endDate) {
    throw new AppError('End date is required', 400)
  }
  if (startDate > endDate) {
    throw new AppError('Start date cannot be after end date', 400)
  }
}

const create = async (eventData) => {
  validateName(eventData.name)
  validateDates(eventData.startDate, eventData.endDate)

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
  validateName(eventData.name)
  validateDates(eventData.startDate, eventData.endDate)

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
