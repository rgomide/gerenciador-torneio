'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query('SELECT id FROM users;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    const roles = await queryInterface.sequelize.query('SELECT id FROM roles;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    // Assign admin role to the first user
    await queryInterface.bulkInsert('users_roles', [
      {
        user_id: users[0].id, // First user (admin)
        role_id: roles[0].id, // Admin role
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: users[0].id, // First user (admin)
        role_id: roles[2].id, // Player role
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: users[1].id, // Second user
        role_id: roles[2].id, // Player role
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users_roles', null, {})
  }
}
