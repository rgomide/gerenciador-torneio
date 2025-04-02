'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const institutions = await queryInterface.sequelize.query('SELECT id, name FROM institutions', {
      type: Sequelize.QueryTypes.SELECT
    })

    const units = institutions.flatMap((institution) => [
      {
        name: `${institution.name} - Unit 1`,
        institution_id: institution.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: `${institution.name} - Unit 2`,
        institution_id: institution.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: `${institution.name} - Unit 3`,
        institution_id: institution.id,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])

    await queryInterface.bulkInsert('units', units)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('units', null, {})
  }
}
