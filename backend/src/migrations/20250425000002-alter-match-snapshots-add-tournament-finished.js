'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('match_snapshots', 'tournament_finished', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      field: 'tournament_finished'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('match_snapshots', 'tournament_finished')
  }
}
