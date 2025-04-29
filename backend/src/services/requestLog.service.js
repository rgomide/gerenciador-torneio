const { RequestLog } = require('@server/models')

const create = async (requestData) => {
  return await RequestLog.create(requestData)
}

module.exports = {
  create
}
