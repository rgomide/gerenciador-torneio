module.exports = {
  async up(queryInterface, Sequelize) {
    const events = await queryInterface.sequelize.query('SELECT id, name FROM events', {
      type: Sequelize.QueryTypes.SELECT
    })

    const now = new Date()

    const tournaments = events.flatMap((event) => {
      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-12-31')

      return [
        {
          name: `${event.name} - Football Tournament`,
          event_id: event.id,
          start_date: startDate,
          end_date: endDate,
          created_at: now,
          updated_at: now
        },
        {
          name: `${event.name} - Basketball Tournament`,
          event_id: event.id,
          start_date: new Date('2024-06-01'),
          end_date: new Date('2024-07-31'),
          created_at: now,
          updated_at: now
        },
        {
          name: `${event.name} - Volleyball Tournament`,
          event_id: event.id,
          start_date: new Date('2024-09-01'),
          end_date: new Date('2024-10-31'),
          created_at: now,
          updated_at: now
        }
      ]
    })

    await queryInterface.bulkInsert('tournaments', tournaments, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tournaments', null, {})
  }
}
