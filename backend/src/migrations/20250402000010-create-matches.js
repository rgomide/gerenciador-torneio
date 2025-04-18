module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('matches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      tournament_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: 'tournaments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      location: {
        allowNull: true,
        type: Sequelize.STRING
      },
      finished: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      occurrences: {
        allowNull: true,
        type: Sequelize.STRING
      },
      round_number: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('matches')
  }
}
