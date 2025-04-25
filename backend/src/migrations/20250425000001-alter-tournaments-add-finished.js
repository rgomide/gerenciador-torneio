'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('tournaments', 'finished', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      field: 'finished'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('tournaments', 'finished')
  }
}
