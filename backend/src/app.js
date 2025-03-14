require('module-alias/register')

const path = require('path')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const swaggerUi = require('swagger-ui-express')
const specs = require('@server/config/swagger.js')
const history = require('connect-history-api-fallback')

const apiMiddleware = require('@server/middleware/api')
const errorHandlingMiddleware = require('@server/middleware/errorHandling')

const app = express()

if (process.env.NODE_ENV === 'production') {
  app.use(
    cors({
      origin: process.env.APP_HOST,
      credentials: true
    })
  )
} else {
  app.use(cors())
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('x-powered-by', false)

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'i.ibb.co'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        fontSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"]
      }
    }
  })
)

app.use('/api', apiMiddleware)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use(
  history({
    index: '/admin/index.html',
    verbose: true
  })
)

app.use('/admin', express.static(path.join(__dirname, '../public/admin')))

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/index.html'))
})

app.use(errorHandlingMiddleware)

module.exports = app
