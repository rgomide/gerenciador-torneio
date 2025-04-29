'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('request_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: true,
        field: 'user_id'
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'user_name'
      },
      ip: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'ip'
      },
      method: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'method'
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'url'
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'status'
      },
      responseTime: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'response_time'
      },
      payload: {
        type: Sequelize.JSONB,
        allowNull: true,
        field: 'payload'
      },
      response: {
        type: Sequelize.JSONB,
        allowNull: true,
        field: 'response'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'created_at',
        defaultValue: Sequelize.NOW
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('request_logs')
  }
}
