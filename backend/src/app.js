require('module-alias/register')

const path = require('path')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const swaggerUi = require('swagger-ui-express')
const specs = require('@server/config/swagger.js')

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

  const seconds = 60

  const limiter = rateLimit({
    windowMs: seconds * 1000,
    limit: 300,
    message: {
      message: `Muitas requisições deste IP, por favor tente novamente após ${seconds} segundos`
    }
  })

  app.use(limiter)
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

const publicPath = path.join(__dirname, '../public')

// SPA under /app: serve files first; anything else (e.g. /app/private/dashboard) → index.html.
// connect-history-api-fallback is unreliable when mounted on a subpath (/app) with Express req.url.
const spaApp = express.Router()
// redirect: false avoids 301 /app ↔ /app/ fights (and loops with proxies). index is still served.
spaApp.use(
  express.static(publicPath, {
    index: 'index.html',
    redirect: false
  })
)
spaApp.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return next()
  }
  res.sendFile(path.join(publicPath, 'index.html'), next)
})

app.use('/app', spaApp)

app.use(errorHandlingMiddleware)

module.exports = app
