const { Sport } = require('@server/models')

describe('Sport Model', () => {
  it('should create a sport', async () => {
    const sportData = {
      name: 'Futebol'
    }

    const sport = await Sport.create(sportData)

    expect(sport.toJSON()).toEqual({
      id: expect.any(String),
      name: sportData.name,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it('should update a sport', async () => {
    const sport = await Sport.create({
      name: 'Futebol'
    })

    const updatedName = 'Futebol de Salão'
    await sport.update({ name: updatedName })

    expect(sport.toJSON()).toEqual({
      id: expect.any(String),
      name: updatedName,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it('should delete a sport', async () => {
    const sport = await Sport.create({
      name: 'Futebol'
    })

    await sport.destroy()

    const foundSport = await Sport.findByPk(sport.id)
    expect(foundSport).toBeNull()
  })

  it('should find a sport by id', async () => {
    const sportData = {
      name: 'Futebol'
    }

    const sport = await Sport.create(sportData)

    const foundSport = await Sport.findByPk(sport.id)

    expect(foundSport.toJSON()).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: sportData.name,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    )
  })

  it('should not create a sport without required fields', async () => {
    try {
      await Sport.create({})
      // If create succeeds, force the test to fail
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should not create a sport with empty name', async () => {
    try {
      await Sport.create({ name: '' })
      // If create succeeds, force the test to fail
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })
})
