import EventCard from '../components/EventsComponents/EventCard'

export default {
  title: 'Components/EventCard',
  component: EventCard
}

export const Default = {
  name: 'Default',
  args: {
    event: {
      id: '1',
      name: 'XV Semana de Integração Esportiva',
      startDate: '2025-04-22T00:00:00Z',
      endDate: '2025-04-28T00:00:00Z',
      unit: {
        id: '1',
        name: 'Campus Trindade',
        institution: {
          id: '1',
          name: 'IF Goiano'
        }
      },
      tournaments: [
        {
          id: '1',
          name: 'Campeonato de Futebol Feminino - Sub 18',
          sport: {
            id: '1',
            name: 'Futebol'
          },
          matches: [
            {
              id: '1',
              date: '2025-04-22T00:00:00Z',
              finished: false,
              location: 'Ginásio de Esportes do IF Goiano'
            },
            {
              id: '2',
              date: '2025-04-25T00:00:00Z',
              finished: false,
              location: 'Atrás da cantina'
            },
            {
              id: '3',
              date: '2025-04-28T00:00:00Z',
              finished: true,
              location: 'Ginásio de Esportes do IF Goiano'
            }
          ]
        },
        {
          id: '2',
          name: 'Campeonato de Futebol Feminino - Sub 18',
          finished: false,
          sport: {
            id: '1',
            name: 'Futebol'
          },
          matches: [
            {
              id: '1',
              date: '2025-04-22T00:00:00Z',
              finished: false,
              location: 'Ginásio de Esportes do IF Goiano'
            }
          ]
        }
      ]
    }
  },
  render: (args) => (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <EventCard {...args} />
    </div>
  )
}
