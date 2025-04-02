'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('institutions', [
      {
        name: 'Institution 1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Institution 2',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Institution 3',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('institutions', null, {})
  }
}
