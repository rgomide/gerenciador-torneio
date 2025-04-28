const TournamentVO = require('@server/vo/TournamentVO')
const UnitVO = require('@server/vo/UnitVO')

class EventVO {
  constructor(event) {
    this.event = event
  }

  toJSON() {
    const { id, name, unitId, startDate, endDate, createdAt, updatedAt, tournaments, unit } =
      this.event

    const tournamentsVO = tournaments
      ? tournaments.map((tournament) => new TournamentVO(tournament).toJSON())
      : null
    const unitVO = unit ? new UnitVO(unit).toJSON() : null

    return {
      id,
      name,
      unitId,
      startDate,
      endDate,
      createdAt,
      updatedAt,
      tournaments: tournamentsVO,
      unit: unitVO
    }
  }

  static parseCollection(events) {
    return events.map((event) => new EventVO(event).toJSON())
  }
}

module.exports = EventVO
