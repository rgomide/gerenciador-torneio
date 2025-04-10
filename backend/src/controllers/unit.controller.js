const {
  create,
  findAll,
  findById,
  findByInstitution,
  update
} = require('@server/services/unit.service')
const router = require('express').Router({ mergeParams: true })
const authorizationMiddleware = require('@server/middleware/authorization')
const {
  ROLES: { ADMIN, MANAGER }
} = require('@server/config/constants')

const UnitVO = require('@server/vo/UnitVO')

/**
 * @openapi
 * /api/units:
 *   get:
 *     description: Get all units
 *     tags:
 *       - Units
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of units
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               example:
 *                 - id: "1"
 *                   name: "Unit 1"
 *                   institutionId: "1"
 *                   institution:
 *                     id: "1"
 *                     name: "Institution 1"
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *                   updatedAt: "2024-01-01T00:00:00.000Z"
 */
router.get('/units', authorizationMiddleware([ADMIN, MANAGER]), async (req, res, next) => {
  try {
    const units = await findAll()
    const unitsVO = UnitVO.parseCollection(units)

    return res.json(unitsVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/institutions/{institutionId}/units:
 *   get:
 *     description: Get all units of an institution
 *     tags:
 *       - Units
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
 *         description: List of units
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               example:
 *                 - id: "1"
 *                   name: "Unit 1"
 *                   institutionId: "1"
 *                   institution:
 *                     id: "1"
 *                     name: "Institution 1"
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *                   updatedAt: "2024-01-01T00:00:00.000Z"
 */
router.get(
  '/institutions/:institutionId/units',
  authorizationMiddleware([ADMIN, MANAGER]),
  async (req, res, next) => {
    try {
      const { institutionId } = req.params
      const units = await findByInstitution(institutionId)
      const unitsVO = UnitVO.parseCollection(units)

      return res.json(unitsVO)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @openapi
 * /api/units/{unitId}:
 *   get:
 *     description: Get a unit by ID
 *     tags:
 *       - Units
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
 *         description: Unit found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 institutionId:
 *                   type: string
 *                 institution:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 */
router.get('/units/:unitId', authorizationMiddleware([ADMIN, MANAGER]), async (req, res, next) => {
  try {
    const { unitId } = req.params
    const unit = await findById(unitId)

    if (!unit) {
      return res.status(404).json({ error: 'Unidade não encontrada' })
    }

    const unitVO = new UnitVO(unit)
    return res.json(unitVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/units:
 *   post:
 *     description: Create a new unit
 *     tags:
 *       - Units
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
 *               institutionId:
 *                 type: string
 *             required:
 *               - name
 *               - institutionId
 *     responses:
 *       201:
 *         description: Unit created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 institutionId:
 *                   type: string
 *                 institution:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 */
router.post('/units', authorizationMiddleware([ADMIN]), async (req, res, next) => {
  try {
    const { name, institutionId } = req.body
    const unit = await create({ name, institutionId })

    const unitVO = new UnitVO(unit)
    return res.status(201).json(unitVO)
  } catch (error) {
    next(error)
  }
})

/**
 * @openapi
 * /api/units/{unitId}:
 *   put:
 *     description: Update a unit by ID
 *     tags:
 *       - Units
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: unitId
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
 *               institutionId:
 *                 type: string
 *             required:
 *               - name
 *               - institutionId
 *     responses:
 *       200:
 *         description: Unit updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 institutionId:
 *                   type: string
 *                 institution:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 */
router.put('/units/:unitId', authorizationMiddleware([ADMIN]), async (req, res, next) => {
  try {
    const { unitId } = req.params
    const { name, institutionId } = req.body

    const unit = await update(unitId, { name, institutionId })
    const unitVO = new UnitVO(unit)

    return res.json(unitVO)
  } catch (error) {
    next(error)
  }
})

module.exports = router
