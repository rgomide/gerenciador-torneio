const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.1.1',
    info: {
      title: 'App Minigame API',
      version: '1.0.0',
      description: 'API documentation for App Minigame',
      contact: {
        name: 'Renato Gomide',
        email: 'renato.gomide@ifgoiano.edu.br'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server'
      },
      {
        url: 'https://app-minigame-backend.onrender.com/',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
          name: 'Authorization',
          description: 'JWT token for authentication'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/controllers/*.js']
}

const specs = swaggerJsdoc(options)
module.exports = specs
