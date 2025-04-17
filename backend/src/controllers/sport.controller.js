const { create, findAll, findById, update, remove } = require('@server/services/sport.service')
const router = require('express').Router({ mergeParams: true })
const authorizationMiddleware = require('@server/middleware/authorization')
const SportVO = require('@server/vo/SportVO')
const {
  ROLES: { ADMIN, MANAGER }
} = require('@server/config/constants')

/**
 * @openapi
 * /api/sports:
 *   get:
 *     description: Get all sports
 *     tags:
 *       - Sports
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sport'
 */
router.get('/', authorizationMiddleware([ADMIN, MANAGER]), async (req, res, next) => {
  try {
    const sports = await findAll()
    const sportsVO = SportVO.parseCollection(sports)

    return res.json(sportsVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/sports/{sportId}:
 *   get:
 *     description: Get a sport by ID
 *     tags:
 *       - Sports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: sportId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sport found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 */
router.get('/:sportId', authorizationMiddleware([ADMIN, MANAGER]), async (req, res, next) => {
  try {
    const { sportId } = req.params
    const sport = await findById(sportId)

    const sportVO = new SportVO(sport)
    return res.json(sportVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/sports:
 *   post:
 *     description: Create a new sport
 *     tags:
 *       - Sports
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
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Sport created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 createdAt:
 */
router.post('/', authorizationMiddleware([ADMIN]), async (req, res, next) => {
  try {
    const { name } = req.body
    const sport = await create({ name })

    const sportVO = new SportVO(sport)
    return res.status(201).json(sportVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/sports/{sportId}:
 *   put:
 *     description: Update a sport by ID
 *     tags:
 *       - Sports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: sportId
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
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Sport updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 */
router.put('/:sportId', authorizationMiddleware([ADMIN]), async (req, res, next) => {
  try {
    const { sportId } = req.params
    const { name } = req.body
    const sport = await update(sportId, { name })

    const sportVO = new SportVO(sport)
    return res.json(sportVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/sports/{sportId}:
 *   delete:
 *     description: Delete a sport by ID
 *     tags:
 *       - Sports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: sportId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Sport deleted successfully
 */
router.delete('/:sportId', authorizationMiddleware([ADMIN]), async (req, res, next) => {
  try {
    const { sportId } = req.params
    await remove(sportId)

    return res.status(204).send()
  } catch (error) {
    next(error)
  }
})

module.exports = router
