const { sequelize } = require('@server/models')

beforeAll(async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ force: true })
  } catch (error) {
    console.error('Test database connection error:', error)
    throw error
  }
})

afterAll(async () => {
  await sequelize.close()
})

// Clean up tables after each test
afterEach(async () => {
  await Promise.all(
    Object.values(sequelize.models).map((model) => {
      model.destroy({ truncate: { cascade: true }, force: true })
    })
  )
})
