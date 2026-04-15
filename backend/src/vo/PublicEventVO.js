class PublicEventVO {
  constructor(event) {
    this.event = event
  }

  toJSON() {
    const { id, name, startDate, endDate, unit } = this.event

    return {
      id,
      name,
      startDate,
      endDate,
      unitName: unit ? unit.name : null,
      institutionName: unit && unit.institution ? unit.institution.name : null
    }
  }

  static parseCollection(events) {
    return events.map((event) => new PublicEventVO(event).toJSON())
  }
}

module.exports = PublicEventVO
