const {
  Match,
  MatchSnapshot,
  Tournament,
  MatchScore,
  Team,
  Player,
  MatchParticipant,
  Unit,
  Institution,
  Event
} = require('@server/models')
const MatchSnapshotVO = require('@server/vo/MatchSnapshotVO')
const AppError = require('@server/utils/AppError')

const validateTournament = async (tournamentId) => {
  const tournament = await Tournament.findByPk(tournamentId)
  if (!tournament) {
    throw new AppError('Torneio não encontrado', 404)
  }

  return tournament
}

const validateDate = (date) => {
  if (!date) {
    throw new AppError('Data é obrigatória', 400)
  }
}

const create = async (matchData) => {
  const tournament = await validateTournament(matchData.tournamentId)

  if (tournament.finished) {
    throw new AppError('Torneio já finalizado', 400)
  }

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

const finish = async (matchId) => {
  const match = await Match.findByPk(matchId, {
    include: [
      {
        model: Tournament,
        as: 'tournament',
        include: [
          {
            model: Event,
            as: 'event',
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
              }
            ]
          },
          'sport'
        ]
      },
      {
        model: MatchParticipant,
        as: 'participants',
        include: [
          {
            model: Team,
            as: 'team'
          },
          {
            model: Player,
            as: 'player'
          }
        ]
      },
      {
        model: MatchScore,
        as: 'scores',
        include: [
          {
            model: Team,
            as: 'team'
          },
          {
            model: Player,
            as: 'player'
          }
        ]
      }
    ]
  })

  if (!match) {
    throw new AppError('Partida não encontrada', 404)
  }

  if (match.finished) {
    throw new AppError('Partida já finalizada', 400)
  }

  const matchSnapshot = MatchSnapshotVO.fromMatch(match)
  await MatchSnapshot.create(matchSnapshot)

  await match.update({ finished: true })

  return findById(matchId)
}

module.exports = {
  create,
  finish,
  findAll,
  findById,
  findByTournament,
  update,
  remove
}
