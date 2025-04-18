const { sequelize } = require('@server/models')
const { Sequelize } = require('sequelize')

// Track if we've modified the database in this test
let dbModified = false
const originalCreate = Sequelize.Model.create
const originalBulkCreate = Sequelize.Model.bulkCreate
const originalUpdate = Sequelize.Model.update
const originalDestroy = Sequelize.Model.destroy

// Cache table structure info for faster lookups
const tableCache = {
  names: null,
  dialect: null,
  initialized: false
}

// Initialize cache and hook up model tracking
beforeAll(async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ force: true })

    // Set up tracking for database modifications
    Sequelize.Model.create = function (...args) {
      dbModified = true
      return originalCreate.apply(this, args)
    }

    Sequelize.Model.bulkCreate = function (...args) {
      dbModified = true
      return originalBulkCreate.apply(this, args)
    }

    Sequelize.Model.update = function (...args) {
      dbModified = true
      return originalUpdate.apply(this, args)
    }

    Sequelize.Model.destroy = function (...args) {
      dbModified = true
      return originalDestroy.apply(this, args)
    }

    // Initialize table cache
    tableCache.names = Object.keys(sequelize.models)
      .map((model) => sequelize.models[model].tableName)
      .filter((name) => name !== 'SequelizeMeta') // Skip migration table
    tableCache.dialect = sequelize.options.dialect
    tableCache.initialized = true
  } catch (error) {
    console.error('Test database connection error:', error)
    throw error
  }
})

afterAll(async () => {
  // Restore original model methods
  Sequelize.Model.create = originalCreate
  Sequelize.Model.bulkCreate = originalBulkCreate
  Sequelize.Model.update = originalUpdate
  Sequelize.Model.destroy = originalDestroy

  await sequelize.close()
})

// Reset the dbModified flag before each test
beforeEach(() => {
  dbModified = false
})

// Fast cleanup, but only if the database was modified
afterEach(async () => {
  // Skip cleanup if no database modifications were made
  if (!dbModified) {
    return
  }

  const transaction = await sequelize.transaction()
  try {
    const { names: tableNames } = tableCache
    if (!tableNames || tableNames.length === 0) return

    // Disable foreign key checks/constraints
    await sequelize.query('SET session_replication_role = replica', { transaction })

    // Fast truncate operation specific to each dialect
    // In PostgreSQL, we can truncate multiple tables in one operation with CASCADE
    const tableList = tableNames.map((name) => `"${name}"`).join(', ')
    await sequelize.query(`TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE`, { transaction })

    // Re-enable foreign key checks/constraints
    await sequelize.query('SET session_replication_role = DEFAULT', { transaction })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    console.error('Error during test cleanup:', error)
    throw error
  }
})
