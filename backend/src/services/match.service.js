const { Match, Tournament, MatchScore, Team, Player } = require('@server/models')
const AppError = require('@server/utils/AppError')

const validateTournament = async (tournamentId) => {
  const tournament = await Tournament.findByPk(tournamentId)
  if (!tournament) {
    throw new AppError('Torneio não encontrado', 404)
  }
}

const validateDate = (date) => {
  if (!date) {
    throw new AppError('Data é obrigatória', 400)
  }
}

const create = async (matchData) => {
  await validateTournament(matchData.tournamentId)
  validateDate(matchData.date)

  return Match.create(matchData)
}

const findAll = async () => {
  const matches = await Match.findAll({
    include: [
      {
        model: MatchScore,
        as: 'scores',
        include: [
          {
            model: Team,
            as: 'team',
            attributes: ['id', 'name']
          },
          {
            model: Player,
            as: 'player',
            attributes: ['id', 'name']
          }
        ]
      }
    ]
  })

  return matches
}

const findById = async (id) => {
  const match = await Match.findByPk(id, {
    include: [
      {
        model: MatchScore,
        as: 'scores',
        include: [
          {
            model: Team,
            as: 'team',
            attributes: ['id', 'name']
          },
          {
            model: Player,
            as: 'player',
            attributes: ['id', 'name']
          }
        ]
      }
    ]
  })

  if (!match) {
    throw new AppError('Partida não encontrada', 404)
  }

  return match
}

const findByTournament = async (tournamentId) => {
  await validateTournament(tournamentId)

  return Match.findAll({ where: { tournament_id: tournamentId } })
}

const update = async (id, matchData) => {
  const match = await Match.findByPk(id)
  if (!match) {
    throw new AppError('Partida não encontrada', 404)
  }

  if (matchData.tournamentId) {
    await validateTournament(matchData.tournamentId)
  }

  if (matchData.date) {
    validateDate(matchData.date)
  }

  await match.update(matchData)

  return findById(id)
}

const remove = async (id) => {
  const match = await Match.findByPk(id)
  if (!match) {
    throw new AppError('Partida não encontrada', 404)
  }

  await match.destroy()
}

module.exports = {
  create,
  findAll,
  findById,
  findByTournament,
  update,
  remove
}
