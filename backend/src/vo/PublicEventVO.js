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
}

module.exports = PublicEventVO
