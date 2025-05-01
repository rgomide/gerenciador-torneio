import { delay, http, HttpResponse } from 'msw'

const DELAY = 200

export const globalHandlers = [
  http.get('http://localhost:3000/api/institutions/:institutionId/units', async ({ params }) => {
    const { institutionId } = params
    await delay(DELAY)
    return HttpResponse.json([
      {
        id: 1,
        name: 'Campus Trindade',
        createdAt: '2025-04-22T22:16:05.615Z',
        updatedAt: '2025-04-22T22:16:05.615Z'
      },
      {
        id: 2,
        name: 'Campus Rio Verde',
        createdAt: '2025-04-22T22:16:05.615Z',
        updatedAt: '2025-04-22T22:16:05.615Z'
      }
    ])
  }),
  http.post('http://localhost:3000/api/units', async ({ request }) => {
    const { name } = await request.json()
    return HttpResponse.json({ id: 1, name }, { status: 201 })
  }),
  http.put('http://localhost:3000/api/units/:id', async ({ request, params }) => {
    const { name } = await request.json()
    const { id } = params
    return HttpResponse.json({ id, name }, { status: 200 })
  }),
  http.delete('http://localhost:3000/api/units/:id', async ({ params }) => {
    const { id } = params
    return HttpResponse.json({ message: 'Unidade deletada com sucesso' }, { status: 204 })
  }),
  http.get('http://localhost:3000/api/units/:unitId/players', async ({ params }) => {
    const { unitId } = params
    await delay(DELAY)
    return HttpResponse.json([
      {
        id: 1,
        name: 'Player 1',
        email: 'player1@example.com',
        phone: '12345678901',
        createdAt: '2025-04-22T22:16:05.615Z',
        updatedAt: '2025-04-22T22:16:05.615Z'
      },
      {
        id: 2,
        name: 'Player 2',
        email: 'player2@example.com',
        phone: '12345678902',
        createdAt: '2025-04-22T22:16:05.615Z',
        updatedAt: '2025-04-22T22:16:05.615Z'
      },
      {
        id: 3,
        name: 'Player 3',
        email: 'player3@example.com',
        phone: '12345678903',
        createdAt: '2025-04-22T22:16:05.615Z',
        updatedAt: '2025-04-22T22:16:05.615Z'
      }
    ])
  }),
  http.post('http://localhost:3000/api/players', async ({ request }) => {
    const { name, email, phone } = await request.json()
    return HttpResponse.json({ id: 1, name, email, phone }, { status: 201 })
  }),
  http.put('http://localhost:3000/api/players/:id', async ({ request, params }) => {
    const { name, email, phone } = await request.json()
    const { id } = params
    return HttpResponse.json({ id, name, email, phone }, { status: 200 })
  }),
  http.delete('http://localhost:3000/api/players/:id', async ({ params }) => {
    const { id } = params
    return HttpResponse.json({ message: 'Player deletado com sucesso' }, { status: 204 })
  }),
  http.get('http://localhost:3000/api/institutions', async () => {
    await delay(DELAY)
    return HttpResponse.json([
      {
        id: 1,
        name: 'Instituto Federal de Goiás',
        createdAt: '2025-04-22T22:16:05.615Z',
        updatedAt: '2025-04-22T22:16:05.615Z'
      },
      {
        id: 2,
        name: 'Instituto Federal Goiano',
        createdAt: '2025-04-22T22:16:05.615Z',
        updatedAt: '2025-04-22T22:16:05.615Z'
      }
    ])
  }),
  http.post('http://localhost:3000/api/institutions', async ({ request }) => {
    const { name } = await request.json()
    return HttpResponse.json({ id: 1, name }, { status: 201 })
  }),
  http.put('http://localhost:3000/api/institutions/:id', async ({ request, params }) => {
    const { name } = await request.json()
    const { id } = params
    return HttpResponse.json({ id, name }, { status: 200 })
  }),
  http.delete('http://localhost:3000/api/users/:id', async ({ request, params }) => {
    const { id } = params
    return HttpResponse.json({ message: 'Usuário deletado com sucesso' }, { status: 204 })
  }),
  http.post('http://localhost:3000/api/users', async ({ request }) => {
    const { userName, firstName, lastName, email, password } = await request.json()
    return HttpResponse.json(
      {
        id: '1',
        userName,
        firstName,
        lastName,
        email,
        password
      },
      { status: 201 }
    )
  }),
  http.put('http://localhost:3000/api/users/:id', async ({ request, params }) => {
    const { userName, firstName, lastName, email, password } = await request.json()
    const { id } = params

    return HttpResponse.json(
      {
        id,
        userName,
        firstName,
        lastName,
        email,
        password
      },
      { status: 200 }
    )
  }),
  http.get('http://localhost:3000/api/users', async () => {
    await delay(DELAY)

    return HttpResponse.json([
      {
        id: '3',
        email: 'denecley@gmail.com',
        userName: 'admin',
        firstName: 'Denecley',
        lastName: 'Alvim',
        isAdmin: true,
        isManager: true,
        roles: ['admin', 'manager'],
        createdAt: '2025-04-22T22:16:05.615Z',
        updatedAt: '2025-04-22T22:16:05.615Z'
      },
      {
        id: '4',
        email: 'jane@example.com',
        userName: 'janesmith',
        firstName: 'Jane',
        lastName: 'Smith',
        isAdmin: false,
        isManager: true,
        roles: ['manager'],
        createdAt: '2025-04-22T22:16:05.615Z',
        updatedAt: '2025-04-22T22:16:05.615Z'
      }
    ])
  }),
  http.get('http://localhost:3000/api/units', async () => {
    await delay(DELAY)

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
    await delay(DELAY)
    return HttpResponse.json([
      { id: 1, name: 'Futebol', createdAt: '2025-04-22T22:16:05.615Z', updatedAt: '2025-04-22T22:16:05.615Z' },
      { id: 2, name: 'Vôlei', createdAt: '2025-04-22T22:16:05.615Z', updatedAt: '2025-04-22T22:16:05.615Z' },
      { id: 3, name: 'Basquete', createdAt: '2025-04-22T22:16:05.615Z', updatedAt: '2025-04-22T22:16:05.615Z' },
      { id: 4, name: 'Handebol', createdAt: '2025-04-22T22:16:05.615Z', updatedAt: '2025-04-22T22:16:05.615Z' },
      { id: 5, name: 'Tênis', createdAt: '2025-04-22T22:16:05.615Z', updatedAt: '2025-04-22T22:16:05.615Z' }
    ])
  }),
  http.post('http://localhost:3000/api/sports', async ({ request }) => {
    const { name } = await request.json()
    return HttpResponse.json({ id: 1, name }, { status: 201 })
  }),
  http.put('http://localhost:3000/api/sports/:id', async ({ request, params }) => {
    const { name } = await request.json()
    const { id } = params
    return HttpResponse.json({ id, name }, { status: 200 })
  }),
  http.delete('http://localhost:3000/api/sports/:id', async ({ params }) => {
    const { id } = params
    return HttpResponse.json({ message: 'Esporte deletado com sucesso' }, { status: 204 })
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
    await delay(DELAY)
    return HttpResponse.json([
      { id: 1, name: 'Event 1' },
      { id: 2, name: 'Event 2' }
    ])
  }),
  http.get('http://localhost:3000/api/units/:unitId/events', async () => {
    await delay(DELAY)
    return HttpResponse.json([
      {
        id: 1,
        name: 'Event 1',
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-01-02T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 2,
        name: 'Event 2',
        startDate: '2024-01-03T00:00:00.000Z',
        endDate: '2024-01-04T00:00:00.000Z',
        createdAt: '2024-01-03T00:00:00.000Z',
        updatedAt: '2024-01-03T00:00:00.000Z'
      }
    ])
  }),
  http.get('http://localhost:3000/api/units/:unitId/teams', async () => {
    await delay(DELAY)
    return HttpResponse.json([
      {
        id: 1,
        name: 'Team 1',
        sport: { id: 1, name: 'Futebol' },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 2,
        name: 'Team 2',
        sport: { id: 2, name: 'Vôlei' },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ])
  }),
  http.post('http://localhost:3000/api/teams', async ({ request }) => {
    const { name, unitId, sportId } = await request.json()
    return HttpResponse.json({ id: 1, name, unitId, sportId }, { status: 201 })
  }),
  http.put('http://localhost:3000/api/teams/:id', async ({ request, params }) => {
    const { name, unitId, sportId } = await request.json()
    const { id } = params
    return HttpResponse.json({ id, name, unitId, sportId }, { status: 200 })
  }),
  http.delete('http://localhost:3000/api/teams/:id', async ({ params }) => {
    const { id } = params
    return HttpResponse.json({ message: 'Equipe deletada com sucesso' }, { status: 204 })
  }),
  http.post('http://localhost:3000/api/events', async ({ request }) => {
    const { name, unitId, startDate, endDate } = await request.json()
    return HttpResponse.json({ id: 1, name, unitId, startDate, endDate }, { status: 201 })
  }),
  http.put('http://localhost:3000/api/events/:id', async ({ request, params }) => {
    const { name, unitId, startDate, endDate } = await request.json()
    const { id } = params
    return HttpResponse.json({ id, name, unitId, startDate, endDate }, { status: 200 })
  }),
  http.delete('http://localhost:3000/api/events/:id', async ({ params }) => {
    const { id } = params
    return HttpResponse.json({ message: 'Evento deletado com sucesso' }, { status: 204 })
  }),
  http.delete('http://localhost:3000/api/tournaments/:id', async () => {
    await delay(DELAY)
    return HttpResponse.json({ message: 'Torneio deletado com sucesso' }, { status: 200 })
  }),
  http.get('http://localhost:3000/api/events/:eventId/tournaments', async () => {
    await delay(DELAY)
    return HttpResponse.json([
      {
        id: 1,
        name: 'Eliminatórias',
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-01-02T00:00:00.000Z',
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
        startDate: '2024-01-03T00:00:00.000Z',
        endDate: '2024-01-04T00:00:00.000Z',
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
