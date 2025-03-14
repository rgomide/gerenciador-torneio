const router = require('express').Router({ mergeParams: true })
const authorizationMiddleware = require('@server/middleware/authorization')
const {
  ROLES: { ADMIN }
} = require('@server/config/constants')
const { findAll, findById } = require('@server/services/user.service')

const UserVO = require('@server/vo/UserVO')

/**
 * @openapi
 * /api/users:
 *   get:
 *     description: Get all users
 *     tags:
 *       - Users
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
router.get('/', authorizationMiddleware([ADMIN]), async (req, res, next) => {
  try {
    const users = await findAll()
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

module.exports = router
