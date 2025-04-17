class SportVO {
  constructor(sport) {
    this.sport = sport
  }

  toJSON() {
    const { id, name, createdAt, updatedAt } = this.sport

    return {
      id,
      name,
      createdAt,
      updatedAt
    }
  }

  static parseCollection(sports) {
    return sports.map((sport) => new SportVO(sport).toJSON())
  }
}

module.exports = SportVO
