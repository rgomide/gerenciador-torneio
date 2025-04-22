const {
  Match,
  Tournament,
  Event,
  Unit,
  Institution,
  MatchParticipant,
  MatchScore,
  Team,
  Player
} = require('@server/models')

class MatchSnapshotVO {
  constructor(matchSnapshot) {
    this.matchSnapshot = matchSnapshot
  }

  static async fromMatch(match) {
    match = await Match.findByPk(match.id, {
      include: [
        {
          model: Tournament,
          as: 'tournament',
          include: [
            {
              model: Event,
              as: 'event',
              include: [
                {
                  model: Unit,
                  as: 'unit',
                  include: [
                    {
                      model: Institution,
                      as: 'institution'
                    }
                  ]
                }
              ]
            },
            'sport'
          ]
        },
        {
          model: MatchParticipant,
          as: 'participants',
          include: [
            {
              model: Team,
              as: 'team'
            },
            {
              model: Player,
              as: 'player'
            }
          ]
        },
        {
          model: MatchScore,
          as: 'scores',
          include: [
            {
              model: Team,
              as: 'team'
            },
            {
              model: Player,
              as: 'player'
            }
          ]
        }
      ]
    })

    console.log(match.toJSON())
  }
}

module.exports = MatchSnapshotVO
