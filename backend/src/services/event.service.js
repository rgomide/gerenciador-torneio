const { Event, Unit, Tournament, Sport, Match, Institution } = require('@server/models')
const AppError = require('@server/utils/AppError')
const { Op } = require('sequelize')

const validateName = (name) => {
  if (!name) {
    throw new AppError('Nome é obrigatório', 400)
  }
  if (name.trim() === '') {
    throw new AppError('Nome não pode estar vazio', 400)
  }
}

const validateDates = (startDate, endDate) => {
  if (!startDate) {
    throw new AppError('Data de início é obrigatória', 400)
  }
  if (!endDate) {
    throw new AppError('Data de término é obrigatória', 400)
  }
  if (startDate > endDate) {
    throw new AppError('Data de início não pode ser posterior à data de término', 400)
  }
}

const create = async (eventData) => {
  validateName(eventData.name)
  validateDates(eventData.startDate, eventData.endDate)

  const unit = await Unit.findByPk(eventData.unitId)
  if (!unit) {
    throw new AppError('Unidade não encontrada', 404)
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

const findUnfinished = async () => {
  const events = await Event.findAll({
    include: [
      {
        model: Unit,
        as: 'unit',
        include: [
          {
            model: Institution,
            as: 'institution'
          }
        ]
      },
      {
        model: Tournament,
        as: 'tournaments',
        where: { finished: false },
        include: [
          {
            model: Sport,
            as: 'sport'
          },
          {
            model: Match,
            as: 'matches',
            where: { finished: false }
          }
        ]
      }
    ],
    order: [
      [{ model: Tournament, as: 'tournaments' }, 'startDate', 'DESC'],
      [{ model: Tournament, as: 'tournaments' }, { model: Match, as: 'matches' }, 'date', 'DESC']
    ]
  })

  return events
}

const findByUnit = async (unitId, searchParams) => {
  const { name } = searchParams || {}

  const unit = await Unit.findByPk(unitId)
  if (!unit) {
    throw new AppError('Unidade não encontrada', 404)
  }

  const where = {
    unit_id: unitId
  }

  if (name) {
    where.name = {
      [Op.iLike]: `%${name}%`
    }
  }
  return Event.findAll({
    where,
    include: [
      {
        model: Unit,
        as: 'unit'
      }
    ],
    order: [['name', 'ASC']]
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
    throw new AppError('Evento não encontrado', 404)
  }

  return event
}

const findByIdForPublic = async (id) => {
  const event = await Event.findByPk(id, {
    include: [
      {
        model: Unit,
        as: 'unit',
        include: [
          {
            model: Institution,
            as: 'institution',
            attributes: ['id', 'name']
          }
        ],
        attributes: ['id', 'name', 'institutionId']
      }
    ]
  })

  if (!event) {
    throw new AppError('Evento não encontrado', 404)
  }

  return event
}

const update = async (id, eventData, user) => {
  validateName(eventData.name)
  validateDates(eventData.startDate, eventData.endDate)

  const event = await Event.findByPk(id)
  if (!event) {
    throw new AppError('Evento não encontrado', 404)
  }

  if (!eventData.unitId) {
    eventData.unitId = event.unitId
  }

  const unit = await Unit.findByPk(eventData.unitId)

  if (!unit) {
    throw new AppError('Unidade não encontrada', 404)
  }

  validateUser(user, event)

  await event.update(eventData)

  return findById(id)
}

const remove = async (id) => {
  const event = await Event.findByPk(id)
  if (!event) {
    throw new AppError('Evento não encontrado', 404)
  }

  await event.destroy()
}

const validateUser = (user, event) => {
  if (!user || user.isAdmin) {
    return
  }

  const isValid = user.events.some((userEvent) => userEvent.id == event.id)

  if (!isValid) {
    throw new AppError('Usuário não tem permissão para manipular este evento', 403)
  }
}

module.exports = {
  create,
  findAll,
  findByUnit,
  findById,
  findByIdForPublic,
  findUnfinished,
  validateUser,
  update,
  remove
}
