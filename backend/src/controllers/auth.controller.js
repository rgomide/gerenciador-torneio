const router = require('express').Router({ mergeParams: true })
const { login } = require('@server/services/auth.service')
const UserVO = require('@server/vo/UserVO')

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     description: Login
 *     security: []
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - userName
 *               - password
 *     responses:
 *       200:
 *         description: Object containing user and token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 *               example:
 *                 user:
 *                   id: "1"
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   userName: "john.doe"
 *                   email: "john.doe@example.com"
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *                   updatedAt: "2024-01-01T00:00:00.000Z"
 *                   roles: ["admin"]
 *                 token: "eyJhbGciOiJIUzI1NiIsI..."
 */
router.post('/login', async (req, res, next) => {
  try {
    const { userName, password } = req.body
    const { user, token } = await login(userName, password)

    const userVO = new UserVO(user)

    res.json({ user: userVO, token })
  } catch (err) {
    next(err)
  }
})

module.exports = router
