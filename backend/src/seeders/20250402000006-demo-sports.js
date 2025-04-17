module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date()

    const sports = [
      {
        name: 'Futebol',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Vôlei',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Basquete',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Handebol',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Natação',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Atletismo',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Tênis',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Tênis de Mesa',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Xadrez',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Judô',
        created_at: now,
        updated_at: now
      }
    ]

    await queryInterface.bulkInsert('sports', sports, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sports', null, {})
  }
}
