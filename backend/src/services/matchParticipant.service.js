const { MatchParticipant, Match, Team, Player } = require('@server/models')
const AppError = require('@server/utils/AppError')

const validateMatch = async (matchId) => {
  const match = await Match.findByPk(matchId)
  if (!match) {
    throw new AppError('Partida não encontrada', 404)
  }
  return match
}

const validateTeam = async (teamId) => {
  const team = await Team.findByPk(teamId)
  if (!team) {
    throw new AppError('Time não encontrado', 404)
  }
  return team
}

const validatePlayer = async (playerId) => {
  const player = await Player.findByPk(playerId)
  if (!player) {
    throw new AppError('Jogador não encontrado', 404)
  }
  return player
}

const create = async (matchParticipantData) => {
  await validateMatch(matchParticipantData.matchId)

  if (matchParticipantData.participantType === 'team') {
    await validateTeam(matchParticipantData.teamId)
  } else if (matchParticipantData.participantType === 'player') {
    await validatePlayer(matchParticipantData.playerId)
  }

  return MatchParticipant.create(matchParticipantData)
}

const findAll = async () => {
  return MatchParticipant.findAll({
    include: [
      {
        association: 'match',
        include: ['tournament']
      },
      'team',
      'player'
    ]
  })
}

const findById = async (id) => {
  const matchParticipant = await MatchParticipant.findByPk(id, {
    include: [
      {
        association: 'match',
        include: ['tournament']
      },
      'team',
      'player'
    ]
  })

  if (!matchParticipant) {
    throw new AppError('Participante não encontrado', 404)
  }

  return matchParticipant
}

const findByMatch = async (matchId) => {
  await validateMatch(matchId)

  return MatchParticipant.findAll({
    where: { matchId },
    include: [
      {
        association: 'match',
        include: ['tournament']
      },
      'team',
      'player'
    ]
  })
}

const findByTeam = async (teamId) => {
  await validateTeam(teamId)

  return MatchParticipant.findAll({
    where: { teamId },
    include: [
      {
        association: 'match',
        include: ['tournament']
      },
      'team',
      'player'
    ]
  })
}

const findByPlayer = async (playerId) => {
  await validatePlayer(playerId)

  return MatchParticipant.findAll({
    where: { playerId },
    include: [
      {
        association: 'match',
        include: ['tournament']
      },
      'team',
      'player'
    ]
  })
}

const update = async (id, matchParticipantData) => {
  const matchParticipant = await findById(id)

  if (matchParticipantData.matchId) {
    await validateMatch(matchParticipantData.matchId)
  }

  if (matchParticipantData.teamId) {
    await validateTeam(matchParticipantData.teamId)
  }

  if (matchParticipantData.playerId) {
    await validatePlayer(matchParticipantData.playerId)
  }

  return matchParticipant.update(matchParticipantData)
}

const remove = async (id) => {
  const matchParticipant = await findById(id)
  await matchParticipant.destroy()
  return matchParticipant
}

const removeByMatch = async (matchId) => {
  const match = await Match.findByPk(matchId)
  if (!match) {
    throw new AppError('Partida não encontrada', 404)
  }

  await MatchParticipant.destroy({
    where: { matchId }
  })
}

const bulkCreate = async (participantsData) => {
  const match = await Match.findByPk(participantsData[0].matchId)
  if (!match) {
    throw new AppError('Partida não encontrada', 404)
  }

  for (const participant of participantsData) {
    if (participant.participantType === 'team') {
      const team = await Team.findByPk(participant.teamId)
      if (!team) {
        throw new AppError('Time não encontrado', 404)
      }
    } else if (participant.participantType === 'player') {
      const player = await Player.findByPk(participant.playerId)
      if (!player) {
        throw new AppError('Jogador não encontrado', 404)
      }
    }
  }

  return MatchParticipant.bulkCreate(participantsData)
}

module.exports = {
  create,
  findAll,
  findById,
  findByMatch,
  findByTeam,
  findByPlayer,
  update,
  remove,
  removeByMatch,
  bulkCreate
}
