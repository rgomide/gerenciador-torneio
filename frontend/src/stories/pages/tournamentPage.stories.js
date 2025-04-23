import { delay, http, HttpResponse } from 'msw'
import TournamentPage from '../../app/private/tournaments/page'

export default {
  title: 'Pages/TournamentPage',
  component: TournamentPage
}

const handlers = [
  http.get('http://localhost:3000/api/sports', async () => {
    await delay(500)
    return HttpResponse.json([
      { id: 1, name: 'Futebol' },
      { id: 2, name: 'Vôlei' },
      { id: 3, name: 'Basquete' },
      { id: 4, name: 'Handebol' },
      { id: 5, name: 'Tênis' }
    ])
  }),
  http.post('http://localhost:3000/api/tournaments', async ({ request }) => {
    const { name, startDate, endDate, sportId } = await request.json()
    return HttpResponse.json(
      {
        id: 1,
        name,
        startDate,
        endDate,
        sportId
      },
      { status: 201 }
    )
  }),
  http.put('http://localhost:3000/api/tournaments/:id', async ({ request }) => {
    const { name, startDate, endDate, sportId } = await request.json()
    return HttpResponse.json(
      {
        id: 1,
        name,
        startDate,
        endDate,
        sportId
      },
      { status: 200 }
    )
  }),
  http.get('http://localhost:3000/api/events', async () => {
    await delay(500)
    return HttpResponse.json([
      { id: 1, name: 'Event 1' },
      { id: 2, name: 'Event 2' }
    ])
  }),
  http.delete('http://localhost:3000/api/tournaments/:id', async () => {
    await delay(500)
    return HttpResponse.json({ message: 'Torneio deletado com sucesso' }, { status: 200 })
  }),
  http.get('http://localhost:3000/api/events/:eventId/tournaments', async () => {
    await delay(500)
    return HttpResponse.json([
      {
        id: 1,
        name: 'Eliminatórias',
        startDate: '2024-01-01',
        endDate: '2024-01-02',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        sport: {
          id: 1,
          name: 'Futebol'
        }
      },
      {
        id: 2,
        name: 'Final',
        startDate: '2024-01-03',
        endDate: '2024-01-04',
        createdAt: '2024-01-03T00:00:00.000Z',
        updatedAt: '2024-01-03T00:00:00.000Z',
        sport: {
          id: 2,
          name: 'Vôlei'
        }
      }
    ])
  })
]

const handlersWithError = [
  http.get('http://localhost:3000/api/events', async () => {
    await delay(500)
    return HttpResponse.json({ error: 'Erro ao obter eventos' }, { status: 500 })
  })
]

export const Default = {
  name: 'Tournament Page',
  args: {},
  parameters: {
    msw: {
      handlers
    }
  }
}

export const ErrorLoadingEvents = {
  name: 'Error Loading Events',
  args: {},
  parameters: {
    msw: {
      handlers: handlersWithError
    }
  }
}
