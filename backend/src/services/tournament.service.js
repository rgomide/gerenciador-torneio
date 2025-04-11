const { Tournament, Event } = require('@server/models')
const AppError = require('@server/utils/AppError')

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

const create = async (tournamentData) => {
  validateName(tournamentData.name)
  validateDates(tournamentData.startDate, tournamentData.endDate)

  const event = await Event.findByPk(tournamentData.eventId)
  if (!event) {
    throw new AppError('Evento não encontrado', 404)
  }

  return Tournament.create(tournamentData)
}

const findAll = async () => {
  return Tournament.findAll({
    include: [
      {
        model: Event,
        as: 'event'
      }
    ]
  })
}

const findByEvent = async (eventId) => {
  const event = await Event.findByPk(eventId)
  if (!event) {
    throw new AppError('Evento não encontrado', 404)
  }

  return Tournament.findAll({
    where: { event_id: eventId },
    include: [
      {
        model: Event,
        as: 'event'
      }
    ]
  })
}

const findById = async (id) => {
  const tournament = await Tournament.findByPk(id, {
    include: [
      {
        model: Event,
        as: 'event'
      }
    ]
  })

  if (!tournament) {
    throw new AppError('Torneio não encontrado', 404)
  }

  return tournament
}

const update = async (id, tournamentData) => {
  validateName(tournamentData.name)
  validateDates(tournamentData.startDate, tournamentData.endDate)

  const tournament = await Tournament.findByPk(id)
  if (!tournament) {
    throw new AppError('Torneio não encontrado', 404)
  }

  if (!tournamentData.eventId) {
    tournamentData.eventId = tournament.eventId
  }

  const event = await Event.findByPk(tournamentData.eventId)
  if (!event) {
    throw new AppError('Evento não encontrado', 404)
  }

  await tournament.update(tournamentData)

  return findById(id)
}

const remove = async (id) => {
  const tournament = await Tournament.findByPk(id)
  if (!tournament) {
    throw new AppError('Torneio não encontrado', 404)
  }

  await tournament.destroy()
}

module.exports = {
  create,
  findAll,
  findByEvent,
  findById,
  update,
  remove
}
