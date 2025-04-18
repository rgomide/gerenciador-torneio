const { MatchScore, Match, Team, Player } = require('@server/models')
const AppError = require('@server/utils/AppError')

const create = async (scoreData) => {
  const match = await Match.findByPk(scoreData.matchId)
  if (!match) {
    throw new AppError('Partida não encontrada', 404)
  }

  if (scoreData.participantType === 'team') {
    const team = await Team.findByPk(scoreData.teamId)
    if (!team) {
      throw new AppError('Time não encontrado', 404)
    }
  } else if (scoreData.participantType === 'player') {
    const player = await Player.findByPk(scoreData.playerId)
    if (!player) {
      throw new AppError('Jogador não encontrado', 404)
    }
  }

  const score = await MatchScore.create(scoreData)
  return score
}

const update = async (id, scoreData) => {
  const score = await MatchScore.findByPk(id)
  if (!score) {
    throw new AppError('Pontuação não encontrada', 404)
  }

  if (scoreData.matchId) {
    const match = await Match.findByPk(scoreData.matchId)
    if (!match) {
      throw new AppError('Partida não encontrada', 404)
    }
  }

  if (scoreData.participantType === 'team' && scoreData.teamId) {
    const team = await Team.findByPk(scoreData.teamId)
    if (!team) {
      throw new AppError('Time não encontrado', 404)
    }
  } else if (scoreData.participantType === 'player' && scoreData.playerId) {
    const player = await Player.findByPk(scoreData.playerId)
    if (!player) {
      throw new AppError('Jogador não encontrado', 404)
    }
  }

  await score.update(scoreData)
  return score
}

const remove = async (id) => {
  const score = await MatchScore.findByPk(id)
  if (!score) {
    throw new AppError('Pontuação não encontrada', 404)
  }

  await score.destroy()
}

const removeByMatch = async (matchId) => {
  const match = await Match.findByPk(matchId)
  if (!match) {
    throw new AppError('Partida não encontrada', 404)
  }

  await MatchScore.destroy({ where: { matchId } })
}

const bulkCreate = async (scoresData) => {
  if (scoresData.length === 0) {
    throw new AppError('Nenhuma pontuação fornecida', 400)
  }

  const match = await Match.findByPk(scoresData[0].matchId)
  if (!match) {
    throw new AppError('Partida não encontrada', 404)
  }

  for (const scoreData of scoresData) {
    if (scoreData.participantType === 'team') {
      const team = await Team.findByPk(scoreData.teamId)
      if (!team) {
        throw new AppError('Time não encontrado', 404)
      }
    } else if (scoreData.participantType === 'player') {
      const player = await Player.findByPk(scoreData.playerId)
      if (!player) {
        throw new AppError('Jogador não encontrado', 404)
      }
    }
  }

  const scores = await MatchScore.bulkCreate(scoresData)
  return scores
}

module.exports = {
  create,
  update,
  remove,
  removeByMatch,
  bulkCreate
}
