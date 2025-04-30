const router = require('express').Router({ mergeParams: true })
const authorizationMiddleware = require('@server/middleware/authorization')
const {
  ROLES: { ADMIN, MANAGER }
} = require('@server/config/constants')
const { findAll, findById, create, update, remove } = require('@server/services/user.service')

const UserVO = require('@server/vo/UserVO')

/**
 * @openapi
 * /api/users:
 *   get:
 *     description: Get all users
 *     tags:
 *       - Users
 *       - Managers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *             example:
 *               - id: "1"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 userName: "john.doe"
 *                 email: "john.doe@example.com"
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *                 roles: ["admin"]
 *               - id: "2"
 *                 firstName: "Jane"
 *                 lastName: "Smith"
 *                 userName: "jane.smith"
 *                 email: "jane.smith@example.com"
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *                 roles: ["player"]
 */
router.get('/', authorizationMiddleware([ADMIN, MANAGER]), async (req, res, next) => {
  try {
    const authUser = req.user
    const users = await findAll(authUser)
    const usersVO = UserVO.parseCollection(users)

    res.json(usersVO)
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/users/{userId}:
 *   get:
 *     description: Get a user by ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               - id: "1"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 userName: "john.doe"
 *                 email: "john.doe@example.com"
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *                 roles: ["admin"]
 */
router.get('/:userId', authorizationMiddleware([ADMIN]), async (req, res, next) => {
  try {
    const { userId } = req.params

    const user = await findById(userId)
    const userVO = new UserVO(user)

    res.json(userVO.toJSON())
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/users:
 *   post:
 *     description: Create a new user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               id: "1"
 *               userName: "john.doe"
 *               firstName: "John"
 *               lastName: "Doe"
 *               email: "john.doe@example.com"
 *               createdAt: "2024-01-01T00:00:00.000Z"
 *               updatedAt: "2024-01-01T00:00:00.000Z"
 */
router.post('/', authorizationMiddleware([ADMIN]), async (req, res, next) => {
  try {
    const authUser = req.user
    const user = req.body

    const newUser = await create(user, authUser)
    const userVO = new UserVO(newUser)

    res.status(201).json(userVO.toJSON())
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/users/{userId}:
 *   put:
 *     description: Update a user
 *     tags:
 *       - Users
 *       - Managers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               userName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               id: "1"
 *               userName: "john.doe"
 *               firstName: "John"
 *               lastName: "Doe"
 *               email: "john.doe@example.com"
 *               createdAt: "2024-01-01T00:00:00.000Z"
 *               updatedAt: "2024-01-01T00:00:00.000Z"
 */
router.put('/:userId', authorizationMiddleware([ADMIN, MANAGER]), async (req, res, next) => {
  try {
    const authUser = req.user
    const { userId } = req.params
    const user = req.body

    const updatedUser = await update(userId, user, authUser)
    const userVO = new UserVO(updatedUser)

    res.json(userVO.toJSON())
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/users/{userId}:
 *   delete:
 *     description: Delete a user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete('/:userId', authorizationMiddleware([ADMIN]), async (req, res, next) => {
  try {
    const authUser = req.user
    const { userId } = req.params

    await remove(userId, authUser)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

module.exports = router
