'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('match_snapshots', 'total_scores', {
      type: Sequelize.ARRAY(Sequelize.JSONB),
      allowNull: true,
      field: 'total_scores'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('match_snapshots', 'total_scores')
  }
}
