class RequestLogVO {
  constructor(requestLog) {
    this.requestLog = requestLog
  }

  toJSON() {
    const { id, ip, userName, method, url, responseTime, status, createdAt, updatedAt } =
      this.requestLog

    return {
      id,
      ip,
      userName,
      method,
      url,
      responseTime,
      status,
      createdAt,
      updatedAt
    }
  }

  static parseCollection(requestLogs) {
    return requestLogs.map((requestLog) => new RequestLogVO(requestLog).toJSON())
  }
}

module.exports = RequestLogVO
