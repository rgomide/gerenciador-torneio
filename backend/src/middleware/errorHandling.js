const errorHandlingMiddleware = (err, req, res, next) => {
  let { message, statusCode } = err

  if (!statusCode) {
    statusCode = 500
  }

  if (process.env.NODE_ENV !== 'test') {
    console.error(err)
  }

  res.status(statusCode).json({ message })
}

module.exports = errorHandlingMiddleware
