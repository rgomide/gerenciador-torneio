class EventVO {
  constructor(event) {
    this.event = event
  }

  toJSON() {
    const { id, name, unitId, startDate, endDate, createdAt, updatedAt } = this.event

    return {
      id,
      name,
      unitId,
      startDate,
      endDate,
      createdAt,
      updatedAt
    }
  }

  static parseCollection(events) {
    return events.map((event) => new EventVO(event).toJSON())
  }
}

module.exports = EventVO
