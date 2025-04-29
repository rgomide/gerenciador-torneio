const router = require('express').Router({ mergeParams: true })
const { create } = require('@server/services/requestLog.service')

router.use(async (req, res, next) => {
  const startTime = Date.now()
  const originalSend = res.send
  const originalJson = res.json

  // Intercept response.send
  res.send = function (body) {
    return originalSend.call(this, body)
  }

  // Intercept response.json
  res.json = function (body) {
    logRequest(req, res, body, startTime)
    return originalJson.call(this, body)
  }

  next()
})

async function logRequest(req, res, responseBody, startTime) {
  try {
    const { method, body: requestBody, user, originalUrl, url } = req

    if (method.toLowerCase() === 'get') {
      return
    }

    const responseTime = Date.now() - startTime

    await create({
      ip: req.ip,
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
