const { TeamPlayer, Team, Player } = require('@server/models')
const AppError = require('@server/utils/AppError')

const create = async (teamPlayerData) => {
  const team = await Team.findByPk(teamPlayerData.teamId)
  if (!team) {
    throw new AppError('Time não encontrado', 404)
  }

  const player = await Player.findByPk(teamPlayerData.playerId)
  if (!player) {
    throw new AppError('Jogador não encontrado', 404)
  }

  const existingTeamPlayer = await TeamPlayer.findOne({
    where: {
      teamId: teamPlayerData.teamId,
      playerId: teamPlayerData.playerId
    }
  })

  if (existingTeamPlayer) {
    throw new AppError('Jogador já está no time', 400)
  }

  return TeamPlayer.create(teamPlayerData)
}

const findAll = async () => {
  return TeamPlayer.findAll({
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
  })
}

const findById = async (teamId, playerId) => {
  const teamPlayer = await TeamPlayer.findOne({
    where: {
      teamId,
      playerId
    },
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
  })

  if (!teamPlayer) {
    throw new AppError('Relação time-jogador não encontrada', 404)
  }

  return teamPlayer
}

const findByTeam = async (teamId) => {
  const team = await Team.findByPk(teamId)
  if (!team) {
    throw new AppError('Time não encontrado', 404)
  }

  return TeamPlayer.findAll({
    where: { teamId },
    include: [
      {
        model: Player,
        as: 'player'
      }
    ]
  })
}

const findByPlayer = async (playerId) => {
  const player = await Player.findByPk(playerId)
  if (!player) {
    throw new AppError('Jogador não encontrado', 404)
  }

  return TeamPlayer.findAll({
    where: { playerId },
    include: [
      {
        model: Team,
        as: 'team'
      }
    ]
  })
}

const update = async (teamId, playerId, teamPlayerData) => {
  const teamPlayer = await TeamPlayer.findOne({
    where: {
      teamId,
      playerId
    }
  })

  if (!teamPlayer) {
    throw new AppError('Relação time-jogador não encontrada', 404)
  }

  if (teamPlayerData.teamId) {
    const team = await Team.findByPk(teamPlayerData.teamId)
    if (!team) {
      throw new AppError('Time não encontrado', 404)
    }
  }

  if (teamPlayerData.playerId) {
    const player = await Player.findByPk(teamPlayerData.playerId)
    if (!player) {
      throw new AppError('Jogador não encontrado', 404)
    }
  }

  await teamPlayer.update(teamPlayerData)

  return findById(teamPlayer.teamId, teamPlayer.playerId)
}

const remove = async (teamId, playerId) => {
  const teamPlayer = await TeamPlayer.findOne({
    where: {
      teamId,
      playerId
    }
  })

  if (!teamPlayer) {
    throw new AppError('Relação time-jogador não encontrada', 404)
  }

  await teamPlayer.destroy()
}

module.exports = {
  create,
  findAll,
  findById,
  findByTeam,
  findByPlayer,
  update,
  remove
}
