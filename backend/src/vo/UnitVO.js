const InstitutionVO = require('@server/vo/InstitutionVO')
class UnitVO {
  constructor(unit) {
    this.unit = unit
  }

  toJSON() {
    const { id, name, institutionId, createdAt, updatedAt, institution } = this.unit

    const institutionVO = institution ? new InstitutionVO(institution).toJSON() : null

    return {
      id,
      name,
      institutionId,
      createdAt,
      updatedAt,
      institution: institutionVO
    }
  }

  static parseCollection(units) {
    return units.map((unit) => new UnitVO(unit).toJSON())
  }
}

module.exports = UnitVO
