module.exports = {
  async up(queryInterface, Sequelize) {
    const units = await queryInterface.sequelize.query('SELECT id, name FROM units', {
      type: Sequelize.QueryTypes.SELECT
    })

    const sports = await queryInterface.sequelize.query('SELECT id, name FROM sports', {
      type: Sequelize.QueryTypes.SELECT
    })

    const now = new Date()

    const teams = units.flatMap((unit) => {
      return sports.map((sport) => {
        const teamName = `${unit.name} - ${sport.name}`
        return {
          name: teamName,
          unit_id: unit.id,
          sport_id: sport.id,
          created_at: now,
          updated_at: now
        }
      })
    })

    await queryInterface.bulkInsert('teams', teams, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('teams', null, {})
  }
}
