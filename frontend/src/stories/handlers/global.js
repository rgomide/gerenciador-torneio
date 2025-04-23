import { delay, http, HttpResponse } from 'msw'

export const globalHandlers = [
  http.get('http://localhost:3000/api/units', async () => {
    await delay(1000)

    return HttpResponse.json([
      {
        id: 1,
        name: 'Campus Trindade'
      },
      {
        id: 2,
        name: 'Campus Rio Verde'
      },
      {
        id: 3,
        name: 'Campus Ceres'
      },
      {
        id: 4,
        name: 'Campus Cristalina'
      },
      {
        id: 5,
        name: 'Campus Hidrolândia'
      }
    ])
  }),
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
