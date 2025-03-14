require('module-alias/register')

const app = require('@server/app')

app.listen(3000, () => {
  console.log('Listening to port 3000')
})

module.exports = app
