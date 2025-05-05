const router = require('express').Router({ mergeParams: true })
const authorizationMiddleware = require('@server/middleware/authorization')
const { findAll } = require('@server/services/requestLog.service')
const {
  ROLES: { ADMIN }
} = require('@server/config/constants')
const RequestLogVO = require('@server/vo/RequestLogVO')

/**
 * @openapi
 * /api/request-logs:
 *   get:
 *     description: Get all request logs
 *     tags:
 *       - Request Logs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of request logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   ip:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   userName:
 *                     type: string
 *                   method:
 *                     type: string
 *                   url:
 *                     type: string
 *                   payload:
 *                     type: object
 *                   response:
 *                     type: object
 *                   responseTime:
 *                     type: number
 *                   status:
 *                     type: number
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
router.get('/', authorizationMiddleware([ADMIN]), async (req, res, next) => {
  try {
    const requestLogs = await findAll()

    const requestLogsVO = RequestLogVO.parseCollection(requestLogs)

    return res.json(requestLogsVO)
  } catch (error) {
    next(error)
  }
})

module.exports = router
