class UnitVO {
  constructor(unit) {
    this.unit = unit
  }

  toJSON() {
    const { id, name, institutionId, createdAt, updatedAt } = this.unit

    return {
      id,
      name,
      institutionId,
      createdAt,
      updatedAt
    }
  }

  static parseCollection(units) {
    return units.map((unit) => new UnitVO(unit).toJSON())
  }
}

module.exports = UnitVO
