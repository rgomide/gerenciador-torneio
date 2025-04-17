module.exports = {
  async up(queryInterface, Sequelize) {
    const units = await queryInterface.sequelize.query('SELECT id, name FROM units', {
      type: Sequelize.QueryTypes.SELECT
    })

    const now = new Date()

    const players = units.flatMap((unit) => {
      return [
        {
          name: `Player 1 - ${unit.name}`,
          email: `player1.${unit.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
          phone: '(11) 99999-9999',
          unit_id: unit.id,
          created_at: now,
          updated_at: now
        },
        {
          name: `Player 2 - ${unit.name}`,
          email: `player2.${unit.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
          phone: '(11) 99999-9998',
          unit_id: unit.id,
          created_at: now,
          updated_at: now
        },
        {
          name: `Player 3 - ${unit.name}`,
          email: `player3.${unit.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
          phone: '(11) 99999-9997',
          unit_id: unit.id,
          created_at: now,
          updated_at: now
        }
      ]
    })

    await queryInterface.bulkInsert('players', players, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('players', null, {})
  }
}
