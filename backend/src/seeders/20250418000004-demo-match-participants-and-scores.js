'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get existing data
    const matches = await queryInterface.sequelize.query('SELECT id FROM matches', {
      type: Sequelize.QueryTypes.SELECT
    })
    const teams = await queryInterface.sequelize.query('SELECT id FROM teams', {
      type: Sequelize.QueryTypes.SELECT
    })
    const players = await queryInterface.sequelize.query('SELECT id FROM players', {
      type: Sequelize.QueryTypes.SELECT
    })

    // Create match participants
    const matchParticipants = []
    matches.forEach((match, index) => {
      // Add team participants
      if (teams[index % teams.length]) {
        matchParticipants.push({
          match_id: match.id,
          participant_type: 'team',
          team_id: teams[index % teams.length].id,
          player_id: null,
          created_at: new Date(),
          updated_at: new Date()
        })
      }

      // Add player participants
      if (players[index % players.length]) {
        matchParticipants.push({
          match_id: match.id,
          participant_type: 'player',
          team_id: null,
          player_id: players[index % players.length].id,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    })

    await queryInterface.bulkInsert('match_participants', matchParticipants)

    // Create match scores
    const matchScores = []
    matches.forEach((match, index) => {
      // Add team scores
      if (teams[index % teams.length]) {
        matchScores.push({
          match_id: match.id,
          participant_type: 'team',
          team_id: teams[index % teams.length].id,
          player_id: null,
          score: Math.floor(Math.random() * 100),
          details: `Score details for team ${teams[index % teams.length].id}`,
          created_at: new Date(),
          updated_at: new Date()
        })
      }

      // Add player scores
      if (players[index % players.length]) {
        matchScores.push({
          match_id: match.id,
          participant_type: 'player',
          team_id: null,
          player_id: players[index % players.length].id,
          score: Math.floor(Math.random() * 50),
          details: `Score details for player ${players[index % players.length].id}`,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    })

    await queryInterface.bulkInsert('match_scores', matchScores)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('match_scores', null, {})
    await queryInterface.bulkDelete('match_participants', null, {})
  }
}
