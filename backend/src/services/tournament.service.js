const { Tournament, Event } = require('@server/models')
const AppError = require('@server/utils/AppError')

const create = async (tournamentData) => {
  const event = await Event.findByPk(tournamentData.eventId)
  if (!event) {
    throw new AppError('Event not found', 404)
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
    throw new AppError('Event not found', 404)
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
    throw new AppError('Tournament not found', 404)
  }

  return tournament
}

const update = async (id, tournamentData) => {
  const tournament = await Tournament.findByPk(id)
  if (!tournament) {
    throw new AppError('Tournament not found', 404)
  }

  if (!tournamentData.eventId) {
    tournamentData.eventId = tournament.eventId
  }

  const event = await Event.findByPk(tournamentData.eventId)
  if (!event) {
    throw new AppError('Event not found', 404)
  }

  await tournament.update(tournamentData)

  return findById(id)
}

const remove = async (id) => {
  const tournament = await Tournament.findByPk(id)
  if (!tournament) {
    throw new AppError('Tournament not found', 404)
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
