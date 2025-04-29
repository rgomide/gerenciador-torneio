const router = require('express').Router({ mergeParams: true })
const { create } = require('@server/services/requestLog.service')

router.use(async (req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    const { method, url, query, body } = req

    console.log(new Date(), method, url)
    console.log('query', query)
    console.log('body', body)
  }

  if (req.method.toLowerCase() === 'get') {
    return next()
  }

  const startTime = Date.now()
  const originalSend = res.send
  const originalJson = res.json

  // Intercept response.send
  res.send = function (body) {
    logRequest(req, res, body, startTime)
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
