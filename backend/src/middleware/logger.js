const router = require('express').Router({ mergeParams: true })

router.use((req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    return next()
  }

  const { method, url, query, body } = req

  console.log(new Date(), method, url)
  console.log('query', query)
  console.log('body', body)

  next()
})

module.exports = router
