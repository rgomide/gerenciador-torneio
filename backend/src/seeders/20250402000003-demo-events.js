module.exports = {
  async up(queryInterface, Sequelize) {
    const units = await queryInterface.sequelize.query('SELECT id, name FROM units', {
      type: Sequelize.QueryTypes.SELECT
    })

    const now = new Date()

    const events = units.flatMap((unit) => {
      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-12-31')

      return [
        {
          name: `${unit.name} - Summer Games`,
          unit_id: unit.id,
          start_date: startDate,
          end_date: endDate,
          created_at: now,
          updated_at: now
        },
        {
          name: `${unit.name} - Winter Games`,
          unit_id: unit.id,
          start_date: new Date('2024-06-01'),
          end_date: new Date('2024-07-31'),
          created_at: now,
          updated_at: now
        }
      ]
    })

    await queryInterface.bulkInsert('events', events, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('events', null, {})
  }
}
