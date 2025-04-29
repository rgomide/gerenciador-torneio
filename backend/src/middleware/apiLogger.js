const router = require('express').Router({ mergeParams: true })
const requestIp = require('request-ip')
const { create } = require('@server/services/requestLog.service')

const GET = 'get'
const POST = 'post'
const PUT = 'put'
const DELETE = 'delete'
router.use(async (req, res, next) => {
  const { method, url, query, body } = req

  if (process.env.NODE_ENV !== 'test') {
    console.log(new Date(), method, url)
    console.log('query', query)
    console.log('body', body)
  }

  const startTime = Date.now()
  const originalSend = res.send
  const originalJson = res.json

  // Intercept response.send
  res.send = function (body) {
    logRequest(req, res, body, startTime, [GET, POST, PUT])
    return originalSend.call(this, body)
  }

  // Intercept response.json
  res.json = function (body) {
    logRequest(req, res, body, startTime, [GET, DELETE])
    return originalJson.call(this, body)
  }

  next()
})

async function logRequest(req, res, responseBody, startTime, ignoreMethods = []) {
  try {
    const { method, body: requestBody, user, originalUrl, url } = req
    const clientIp = requestIp.getClientIp(req)

    if (ignoreMethods.includes(method.toLowerCase())) {
      return
    }

    const responseTime = Date.now() - startTime

    await create({
      ip: clientIp,
      userId: user?.id,
      userName: user?.userName,
      method,
      url: originalUrl || url,
      payload: requestBody,
      response: responseBody,
      responseTime,
      status: res.statusCode
    })
  } catch (error) {
    console.error('Error logging request:', error)
  }
}

module.exports = router
