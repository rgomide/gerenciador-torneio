const { RequestLog } = require('@server/models')

const create = async (requestData) => {
  return await RequestLog.create(requestData)
}

const findAll = async () => {
  return await RequestLog.findAll({ order: [['id', 'DESC']] })
}

module.exports = {
  create,
  findAll
}
