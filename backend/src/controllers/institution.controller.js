const { create, findAll, findById, update, remove } = require('@server/services/institution.service')
const router = require('express').Router({ mergeParams: true })
const authorizationMiddleware = require('@server/middleware/authorization')
const {
  ROLES: { ADMIN, MANAGER }
} = require('@server/config/constants')

const InstitutionVO = require('@server/vo/InstitutionVO')

/**
 * @openapi
 * /api/institutions:
 *   post:
 *     description: Create a new institution
 *     tags:
 *       - Institutions
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
 *         description: Institution created successfully
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
 *               example:
 *                 id: "1"
 *                 name: "Institution 1"
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 */
router.post('/', authorizationMiddleware([ADMIN]), async (req, res, next) => {
  try {
    const { name } = req.body
    const institution = await create({ name })

    const institutionVO = new InstitutionVO(institution)

    return res.status(201).json(institutionVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/institutions:
 *   get:
 *     description: Get all institutions
 *     tags:
 *       - Institutions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of institutions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               example:
 *                 - id: "1"
 *                   name: "Institution 1"
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *                   updatedAt: "2024-01-01T00:00:00.000Z"
 *                 - id: "2"
 *                   name: "Institution 2"
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *                   updatedAt: "2024-01-01T00:00:00.000Z"
 */
router.get('/', authorizationMiddleware([ADMIN, MANAGER]), async (req, res, next) => {
  try {
    const institutions = await findAll()
    const institutionsVO = InstitutionVO.parseCollection(institutions)

    return res.json(institutionsVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/institutions/{institutionId}:
 *   get:
 *     description: Get an institution by ID
 *     tags:
 *       - Institutions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: institutionId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Institution found
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
 *               example:
 *                 id: "1"
 *                 name: "Institution 1"
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 */
router.get('/:institutionId', authorizationMiddleware([ADMIN, MANAGER]), async (req, res, next) => {
  try {
    const { institutionId } = req.params

    const institution = await findById(institutionId)

    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' })
    }
    const institutionVO = new InstitutionVO(institution)

    return res.json(institutionVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/institutions/{institutionId}:
 *   put:
 *     description: Update an institution by ID
 *     tags:
 *       - Institutions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: institutionId
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
 *         description: Institution updated successfully
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
 *               example:
 *                 id: "1"
 *                 name: "Institution 1"
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 */
router.put('/:institutionId', authorizationMiddleware([ADMIN]), async (req, res, next) => {
  try {
    const { institutionId } = req.params
    const { name } = req.body

    const institution = await update(institutionId, { name })

    const institutionVO = new InstitutionVO(institution)

    return res.json(institutionVO)
  } catch (error) {
    next(error)
  }
})

module.exports = router