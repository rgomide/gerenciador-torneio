import { Button } from '@/components/ui/button'
import { formatDate } from '@/services/dateUtil'
import { SquareArrowUpRight } from 'lucide-react'

const EventCard = ({ event }) => {
  let { name, unit, tournaments, startDate, endDate } = event

  tournaments = tournaments.filter((tournament) => !tournament.finished)

  const extractMatches = (tournament) => {
    if (!tournament.matches) {
      return []
    }
    return tournament.matches.filter((match) => !match.finished)
  }

  const eventPeriod = `${formatDate(startDate)} a ${formatDate(endDate)}`

  return (
    <div className="flex flex-col border border-gray-300 rounded-md p-4 w-full">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">{name}</h1>
        <h2 className="text-sm text-gray-500">
          {unit?.institution?.name} - {unit.name} de {eventPeriod}
        </h2>
      </div>
      <div className="flex flex-col mt-4">
        {tournaments.map(
          (
            tournament // TOURNAMENT LIST
          ) => (
            <div key={tournament.id} className="flex flex-col">
              <h1 className="text-lg font-bold">
                {tournament.name} ({tournament.sport.name})
              </h1>
              {extractMatches(tournament).map(
                (
                  match // MATCH LIST
                ) => (
                  <div
                    key={match.id}
                    className="flex flex-row justify-between items-center gap-4 hover:bg-gray-100 rounded-md p-2"
                  >
                    <div className="flex flex-col">
                      <h3 className="text-lg text-gray-800">{match.location}</h3>
                      <h3 className="text-sm text-gray-800">{formatDate(match.date)}</h3>
                    </div>
                    <div className="flex flex-col">
                      <Button variant="outline" className="cursor-pointer">
                        <SquareArrowUpRight />
                        Ver partida
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default EventCard
