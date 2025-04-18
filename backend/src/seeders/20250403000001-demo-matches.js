'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tournaments = await queryInterface.sequelize.query(
      'SELECT id FROM tournaments ORDER BY id',
      { type: Sequelize.QueryTypes.SELECT }
    )

    const matches = []
    const locations = ['Quadra 1', 'Quadra 2', 'Quadra 3', 'Quadra 4']
    const occurrences = ['Chuva', 'Falta de jogadores', 'Problemas técnicos', 'Sem ocorrências']

    tournaments.forEach((tournament, index) => {
      // Create 4 matches per tournament
      for (let i = 0; i < 4; i++) {
        const date = new Date()
        date.setDate(date.getDate() + i + 1) // Matches spread across next 4 days

        matches.push({
          tournament_id: tournament.id,
          date,
          location: locations[i],
          finished: i % 2 === 0, // Alternate between finished and not finished
          occurrences: i === 0 ? occurrences[0] : null, // Only first match has an occurrence
          round_number: i + 1,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    })

    await queryInterface.bulkInsert('matches', matches)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('matches', null, {})
  }
}
