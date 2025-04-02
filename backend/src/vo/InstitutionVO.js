class InstitutionVO {
  constructor(institution) {
    this.institutionModel = institution
  }

  toJSON() {
    const { id, name, createdAt, updatedAt } = this.institutionModel
    return { id, name, createdAt, updatedAt }
  }

  static parseCollection(institutions) {
    return institutions.map((institution) => new InstitutionVO(institution).toJSON())
  }
}

module.exports = InstitutionVO
