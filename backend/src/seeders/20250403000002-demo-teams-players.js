'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get all teams
    const teams = await queryInterface.sequelize.query('SELECT id FROM teams ORDER BY id', {
      type: Sequelize.QueryTypes.SELECT
    })

    // Get all players
    const players = await queryInterface.sequelize.query('SELECT id FROM players ORDER BY id', {
      type: Sequelize.QueryTypes.SELECT
    })

    const teamsPlayers = []

    // For each team, assign 11 players (a full team)
    teams.forEach((team, teamIndex) => {
      // Calculate the starting index for this team's players
      const startIndex = teamIndex * 11

      // Assign 11 players to each team
      for (let i = 0; i < 11; i++) {
        const playerIndex = (startIndex + i) % players.length // Wrap around if we run out of players

        teamsPlayers.push({
          team_id: team.id,
          player_id: players[playerIndex].id,
          details: `Jogador ${i + 1} do time ${teamIndex + 1}`,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    })

    await queryInterface.bulkInsert('teams_players', teamsPlayers)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('teams_players', null, {})
  }
}
