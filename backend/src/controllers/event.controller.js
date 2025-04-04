const {
  create,
  findAll,
  findById,
  findByUnit,
  update,
  remove
} = require('@server/services/event.service')
const router = require('express').Router({ mergeParams: true })
const authorizationMiddleware = require('@server/middleware/authorization')
const {
  ROLES: { ADMIN, MANAGER }
} = require('@server/config/constants')

const EventVO = require('@server/vo/EventVO')

/**
 * @openapi
 * /api/events:
 *   get:
 *     description: Get all events
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               example:
 *                 - id: "1"
 *                   name: "Event 1"
 *                   unitId: "1"
 *                   startDate: "2024-01-01T00:00:00.000Z"
 *                   endDate: "2024-01-02T00:00:00.000Z"
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *                   updatedAt: "2024-01-01T00:00:00.000Z"
 */
router.get('/events', authorizationMiddleware([ADMIN, MANAGER]), async (req, res, next) => {
  try {
    const events = await findAll()
    const eventsVO = EventVO.parseCollection(events)

    return res.json(eventsVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/units/{unitId}/events:
 *   get:
 *     description: Get all events of a unit
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: unitId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               example:
 *                 - id: "1"
 *                   name: "Event 1"
 *                   unitId: "1"
 *                   startDate: "2024-01-01T00:00:00.000Z"
 *                   endDate: "2024-01-02T00:00:00.000Z"
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *                   updatedAt: "2024-01-01T00:00:00.000Z"
 */
router.get(
  '/units/:unitId/events',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const { unitId } = req.params
      const events = await findByUnit(unitId)
      const eventsVO = EventVO.parseCollection(events)

      return res.json(eventsVO)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @openapi
 * /api/events/{eventId}:
 *   get:
 *     description: Get an event by ID
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 unitId:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 */
router.get(
  '/events/:eventId',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const { eventId } = req.params
      const event = await findById(eventId)

      if (!event) {
        return res.status(404).json({ error: 'Event not found' })
      }

      const eventVO = new EventVO(event)
      return res.json(eventVO)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @openapi
 * /api/events:
 *   post:
 *     description: Create a new event
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               unitId:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *             required:
 *               - name
 *               - unitId
 *               - startDate
 *               - endDate
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 unitId:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 */
router.post('/events', authorizationMiddleware([ADMIN]), async (req, res, next) => {
  try {
    const { name, unitId, startDate, endDate } = req.body
    const event = await create({ name, unitId, startDate, endDate })

    const eventVO = new EventVO(event)
    return res.status(201).json(eventVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/events/{eventId}:
 *   put:
 *     description: Update an event by ID
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               unitId:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *             required:
 *               - name
 *               - unitId
 *               - startDate
 *               - endDate
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 unitId:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 */
router.put(
  '/events/:eventId',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const { eventId } = req.params
      const { name, unitId, startDate, endDate } = req.body

      const event = await update(eventId, { name, unitId, startDate, endDate })
      const eventVO = new EventVO(event)

      return res.json(eventVO)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @openapi
 * /api/events/{eventId}:
 *   delete:
 *     description: Delete an event by ID
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Event deleted successfully
 */
router.delete('/events/:eventId', authorizationMiddleware([ADMIN]), async (req, res, next) => {
  try {
    const { eventId } = req.params
    await remove(eventId)

    return res.status(204).json({ message: 'Event deleted successfully' })
  } catch (error) {
    next(error)
  }
})
module.exports = router
