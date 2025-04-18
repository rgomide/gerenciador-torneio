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
  // Get all models in reverse order to handle foreign key constraints
  const models = Object.values(sequelize.models).reverse()
  
  // Truncate each model with cascade
  for (const model of models) {
    await model.truncate({ cascade: true, force: true })
  }
})
