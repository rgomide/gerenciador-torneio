const { RequestLog } = require('@server/models')

describe('RequestLog Model', () => {
  describe('Model Definition', () => {
    it('should be defined', () => {
      expect(RequestLog).toBeDefined()
    })

    it('should have correct table name', () => {
      expect(RequestLog.tableName).toBe('request_logs')
    })
  })

  describe('Field Validations', () => {
    it('should create a valid request log', async () => {
      const requestData = {
        ip: '127.0.0.1',
        method: 'GET',
        url: '/api/test',
        status: 200,
        responseTime: 100,
        payload: [{ test: 'data' }],
        response: { success: true }
      }

      const requestLog = await RequestLog.create(requestData)

      expect(requestLog).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          ip: '127.0.0.1',
          method: 'GET',
          url: '/api/test',
          status: 200,
          responseTime: 100,
          payload: [{ test: 'data' }],
          response: { success: true },
          createdAt: expect.any(Date)
        })
      )
    })

    it('should allow null for optional fields', async () => {
      const requestData = {
        ip: '127.0.0.1',
        method: 'GET',
        url: '/api/test',
        status: 200,
        responseTime: 100,
        userId: null,
        userName: null,
        payload: null,
        response: null
      }

      const requestLog = await RequestLog.create(requestData)

      expect(requestLog).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          ip: '127.0.0.1',
          method: 'GET',
          url: '/api/test',
          status: 200,
          responseTime: 100,
          userId: null,
          userName: null,
          payload: null,
          response: null,
          createdAt: expect.any(Date)
        })
      )
    })

    it('should not allow null for required fields', async () => {
      const requiredFields = ['ip', 'method', 'url', 'status', 'responseTime']

      for (const field of requiredFields) {
        const requestData = {
          ip: '127.0.0.1',
          method: 'GET',
          url: '/api/test',
          status: 200,
          responseTime: 100
        }
        delete requestData[field]

        await expect(RequestLog.create(requestData)).rejects.toThrow()
      }
    })
  })

  describe('JSONB Fields', () => {
    it('should store complex JSON payload', async () => {
      const complexPayload = {
        users: [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' }
        ],
        metadata: {
          timestamp: '2024-01-01',
          version: '1.0'
        }
      }

      const requestData = {
        ip: '127.0.0.1',
        method: 'POST',
        url: '/api/users',
        status: 201,
        responseTime: 150,
        payload: complexPayload
      }

      const requestLog = await RequestLog.create(requestData)

      expect(requestLog).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          ip: '127.0.0.1',
          method: 'POST',
          url: '/api/users',
          status: 201,
          responseTime: 150,
          payload: complexPayload,
          createdAt: expect.any(Date)
        })
      )
    })

    it('should store array of JSON objects in response', async () => {
      const arrayResponse = [
        { id: 1, status: 'success' },
        { id: 2, status: 'pending' }
      ]

      const requestData = {
        ip: '127.0.0.1',
        method: 'GET',
        url: '/api/items',
        status: 200,
        responseTime: 120,
        response: arrayResponse
      }

      const requestLog = await RequestLog.create(requestData)

      expect(requestLog).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          ip: '127.0.0.1',
          userId: null,
          userName: null,
          method: 'GET',
          url: '/api/items',
          status: 200,
          responseTime: 120,
          payload: null,
          response: arrayResponse,
          createdAt: expect.any(Date)
        })
      )
    })
  })

  describe('CRUD Operations', () => {
    it('should find created request log', async () => {
      const requestData = {
        ip: '127.0.0.1',
        method: 'GET',
        url: '/api/test',
        status: 200,
        responseTime: 100
      }

      const createdLog = await RequestLog.create(requestData)
      const foundLog = await RequestLog.findByPk(createdLog.id)

      expect(foundLog).toEqual(
        expect.objectContaining({
          ...requestData,
          id: createdLog.id,
          createdAt: expect.any(Date)
        })
      )
    })

    it('should update request log', async () => {
      const requestData = {
        ip: '127.0.0.1',
        method: 'GET',
        url: '/api/test',
        status: 200,
        responseTime: 100
      }

      const log = await RequestLog.create(requestData)
      await log.update({ status: 404 })
      const updatedLog = await RequestLog.findByPk(log.id)

      expect(updatedLog).toEqual(
        expect.objectContaining({
          ...requestData,
          id: log.id,
          status: 404,
          createdAt: expect.any(Date)
        })
      )
    })
  })
})
