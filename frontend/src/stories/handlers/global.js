import { delay, http, HttpResponse } from 'msw'

const DELAY = 200

export const globalHandlers = [
  http.get('http://localhost:3000/api/teams/:teamId/players', async ({ params }) => {
    await delay(DELAY)

    const teamId = params.teamId

    return HttpResponse.json([
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        address: '123 Main St, Anytown, USA',
        city: 'Anytown',
        teams: [
          {
            id: teamId,
            name: 'Team 1',
            teamPlayer: {
              details: 'Atacante'
            }
          }
        ]
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '1234567890',
        address: '123 Main St, Anytown, USA',
        city: 'Anytown',
        teams: [
          {
            id: teamId,
            name: 'Team 1',
            teamPlayer: {
              details: 'Zagueiro'
            }
          }
        ]
      }
    ])
  }),
  http.post('http://localhost:3000/api/teams/:teamId/players/bulk', async ({ params }) => {
    await delay(DELAY)

    const teamId = params.teamId

    return HttpResponse.json({})
  }),
  http.get('http://localhost:3000/api/request-logs', async () => {
    await delay(DELAY)
    return HttpResponse.json([
      {
        id: '30',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-05-07T00:08:25.686Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDYxMTA4OTYsImV4cCI6MTc3NzY2ODQ5Nn0.u1X6qgUMHwFz5M9Ww0veusxtWXzoBM2BXOt8EU2gGLU'
        },
        responseTime: 74,
        status: 200,
        createdAt: '2025-05-07T00:08:25.686Z'
      },
      {
        id: '29',
        ip: '::1',
        userId: '3',
        userName: 'admin',
        method: 'DELETE',
        url: '/api/sports/20',
        payload: {},
        response: null,
        responseTime: 17,
        status: 204,
        createdAt: '2025-04-29T23:50:22.457Z'
      },
      {
        id: '28',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5NzAzNzEsImV4cCI6MTc3NzUyNzk3MX0.VEcNgivTZ2NYpiZuFRlay17tHLuKfGJeNXE2oCXxec8'
        },
        responseTime: 5,
        status: 200,
        createdAt: '2025-04-29T23:46:11.264Z'
      },
      {
        id: '27',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5Njk5ODksImV4cCI6MTc3NzUyNzU4OX0.nqS3GMkVwyvBdjhlGTNf0NIyq389wiMUazb_Re2RyBs'
        },
        responseTime: 4,
        status: 200,
        createdAt: '2025-04-29T23:39:49.630Z'
      },
      {
        id: '26',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5Njk5MjcsImV4cCI6MTc3NzUyNzUyN30.-gHTpDlYiXEmp_PwlkEcCnnUV8uoq7-NQ5og6kgcy_s'
        },
        responseTime: 12,
        status: 200,
        createdAt: '2025-04-29T23:38:47.391Z'
      },
      {
        id: '25',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5Njk5MDIsImV4cCI6MTc3NzUyNzUwMn0.AHk2wxDRSIGhcWXTYBGR0NayspoTeKCw6hfL9Au45sk'
        },
        responseTime: 4,
        status: 200,
        createdAt: '2025-04-29T23:38:22.323Z'
      },
      {
        id: '24',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5Njk4OTksImV4cCI6MTc3NzUyNzQ5OX0.hgCQAIzD5dBLV9OkjxH8IRpXmG4eK3E6Pd_yq_OkE4E'
        },
        responseTime: 11,
        status: 200,
        createdAt: '2025-04-29T23:38:19.221Z'
      },
      {
        id: '23',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5NjkzMzcsImV4cCI6MTc3NzUyNjkzN30.R21FAdCZTBJRijNuOYWUzzRVXbRc-K7EBrOZIpWAwoQ'
        },
        responseTime: 15,
        status: 200,
        createdAt: '2025-04-29T23:28:57.741Z'
      },
      {
        id: '22',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5NjkyODAsImV4cCI6MTc3NzUyNjg4MH0.hJ7anXrpWl1tOKqoxtrfqsItt-0GkgzpEtB56JQM_NM'
        },
        responseTime: 3,
        status: 200,
        createdAt: '2025-04-29T23:28:00.615Z'
      },
      {
        id: '21',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5NjkyNzQsImV4cCI6MTc3NzUyNjg3NH0.kHv01-qMEVIqQbgVs79t-HPQne9xgqD7fzS_LvTIjXM'
        },
        responseTime: 18,
        status: 200,
        createdAt: '2025-04-29T23:27:54.222Z'
      },
      {
        id: '20',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5NjkwMzcsImV4cCI6MTc3NzUyNjYzN30.FVj0oBWLIGFQzAIocxd_6uG4n0x2LguKptyybiFbkig'
        },
        responseTime: 12,
        status: 200,
        createdAt: '2025-04-29T23:23:57.149Z'
      },
      {
        id: '19',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5Njg5NDMsImV4cCI6MTc3NzUyNjU0M30.grZzMODo1Pe6gh4KB_h7l5kVj7XgDkyTvToXDmnsImE'
        },
        responseTime: 17,
        status: 200,
        createdAt: '2025-04-29T23:22:23.881Z'
      },
      {
        id: '18',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5NjgwMzcsImV4cCI6MTc3NzUyNTYzN30.UFHopuDYaLvJ07n-fPfs1YOxUoTVi4YiQgTXoVnwgFA'
        },
        responseTime: 45,
        status: 200,
        createdAt: '2025-04-29T23:07:17.458Z'
      },
      {
        id: '17',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5NjgwMTIsImV4cCI6MTc3NzUyNTYxMn0.p0WDiHTRCdwlBsE__HcIVBoVsB50VgpZSyLdKNufc34'
        },
        responseTime: 40,
        status: 200,
        createdAt: '2025-04-29T23:06:52.820Z'
      },
      {
        id: '16',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5Njc5NjIsImV4cCI6MTc3NzUyNTU2Mn0.XRin6HMT-KFo1q-aqHhxirDRzTku5FvFR_aY_fSHA7I'
        },
        responseTime: 52,
        status: 200,
        createdAt: '2025-04-29T23:06:02.381Z'
      },
      {
        id: '15',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5Njc2OTIsImV4cCI6MTc3NzUyNTI5Mn0.bKTFrpNmcQc92j1md1SfIOgXvErVddfr3rPgxf0A9vM'
        },
        responseTime: 50,
        status: 200,
        createdAt: '2025-04-29T23:01:32.580Z'
      },
      {
        id: '14',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5Njc2NDgsImV4cCI6MTc3NzUyNTI0OH0.Dt-9g9iWK1q1kcAtZmUkY6XrbM2FdBLygJekCLBPNlA'
        },
        responseTime: 13,
        status: 200,
        createdAt: '2025-04-29T23:00:48.309Z'
      },
      {
        id: '13',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5Njc1NjQsImV4cCI6MTc3NzUyNTE2NH0.UbydCZT4uCIFpwpFEjhBTMK19bfByj2BsCnV1RLtvSw'
        },
        responseTime: 3,
        status: 200,
        createdAt: '2025-04-29T22:59:24.394Z'
      },
      {
        id: '12',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5Njc1MTUsImV4cCI6MTc3NzUyNTExNX0.iFSjBdGuIGVk4nR9CYF9pwSfuFol87cFTcIKKe4ZvfA'
        },
        responseTime: 4,
        status: 200,
        createdAt: '2025-04-29T22:58:35.255Z'
      },
      {
        id: '11',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5Njc0MTcsImV4cCI6MTc3NzUyNTAxN30.erJm2wavXm_aufO7ymg12ciIX48VLJdvyUsHgjoI_dU'
        },
        responseTime: 5,
        status: 200,
        createdAt: '2025-04-29T22:56:57.252Z'
      },
      {
        id: '10',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5Njc0MDUsImV4cCI6MTc3NzUyNTAwNX0.YUbD9FLyYMbjs8fORYzbjw3atKMIGo423KtHLU_uCSY'
        },
        responseTime: 3,
        status: 200,
        createdAt: '2025-04-29T22:56:45.432Z'
      },
      {
        id: '9',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5NjczODAsImV4cCI6MTc3NzUyNDk4MH0.7koLFoGX4pG5Q2dN-oc3w8_dy0M2kFEaHIK7g3HOzDk'
        },
        responseTime: 5,
        status: 200,
        createdAt: '2025-04-29T22:56:20.478Z'
      },
      {
        id: '8',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5NjcyNzcsImV4cCI6MTc3NzUyNDg3N30.FqZ-R4aRyq5e75-7Q35m2AeGXLoVvfTWkoGqX4Qie-0'
        },
        responseTime: 3,
        status: 200,
        createdAt: '2025-04-29T22:54:37.450Z'
      },
      {
        id: '7',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5NjcyNTAsImV4cCI6MTc3NzUyNDg1MH0.Ns6-VW7i9OfHLp1qUkxMmv6uYb0xyygD28qpNdIFEpk'
        },
        responseTime: 13,
        status: 200,
        createdAt: '2025-04-29T22:54:10.079Z'
      },
      {
        id: '6',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5NjcyMzgsImV4cCI6MTc3NzUyNDgzOH0.d_Pe2_gjFEpQogt2YzRHG3-EV-wc2oqxTdc1GxP2Vk4'
        },
        responseTime: 19,
        status: 200,
        createdAt: '2025-04-29T22:53:58.027Z'
      },
      {
        id: '5',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5NjcxNDEsImV4cCI6MTc3NzUyNDc0MX0.xUEUx2LowxKbsYnlAl8V4SpNdybwPhKjUiemiWtUaPs'
        },
        responseTime: 15,
        status: 200,
        createdAt: '2025-04-29T22:52:21.686Z'
      },
      {
        id: '4',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5NjcxMjcsImV4cCI6MTc3NzUyNDcyN30.N_zFkzhAqmaR6ylD7VqK2XpzUA5do8AN7-5KVQ8UAWs'
        },
        responseTime: 14,
        status: 200,
        createdAt: '2025-04-29T22:52:07.094Z'
      },
      {
        id: '3',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5NjcwNTYsImV4cCI6MTc3NzUyNDY1Nn0.Vt-sMPwl3Kb9IzpBh9_NpMfhQOi9hGtkK5G97mOoDxQ'
        },
        responseTime: 18,
        status: 200,
        createdAt: '2025-04-29T22:50:56.129Z'
      },
      {
        id: '2',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5NjY4NDksImV4cCI6MTc3NzUyNDQ0OX0.XJ72To55qGqTPL4XCJYjuWfsZYYZXP0CSlCf8he9S6M'
        },
        responseTime: 8,
        status: 200,
        createdAt: '2025-04-29T22:47:29.989Z'
      },
      {
        id: '1',
        ip: '::1',
        userId: null,
        userName: null,
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          password: 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae',
          userName: 'admin'
        },
        response: {
          user: {
            id: '3',
            email: 'denecley@gmail.com',
            roles: ['admin', 'manager'],
            isAdmin: true,
            lastName: 'Alvim',
            userName: 'admin',
            createdAt: '2025-04-22T22:16:05.615Z',
            firstName: 'Denecley',
            isManager: true,
            updatedAt: '2025-04-22T22:16:05.615Z'
          },
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3NDU5NjY1MjAsImV4cCI6MTc3NzUyNDEyMH0.yJXan2FxF03yBs_SvKPHeMo8r6g6q4bsf7ypy1YyeSI'
        },
        responseTime: 51,
        status: 200,
        createdAt: '2025-04-29T22:42:00.533Z'
      }
    ])
  }),
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
      {
        id: 1,
        name: 'Futebol',
        createdAt: '2025-04-22T22:16:05.615Z',
        updatedAt: '2025-04-22T22:16:05.615Z'
      },
      {
        id: 2,
        name: 'Vôlei',
        createdAt: '2025-04-22T22:16:05.615Z',
        updatedAt: '2025-04-22T22:16:05.615Z'
      },
      {
        id: 3,
        name: 'Basquete',
        createdAt: '2025-04-22T22:16:05.615Z',
        updatedAt: '2025-04-22T22:16:05.615Z'
      },
      {
        id: 4,
        name: 'Handebol',
        createdAt: '2025-04-22T22:16:05.615Z',
        updatedAt: '2025-04-22T22:16:05.615Z'
      },
      {
        id: 5,
        name: 'Tênis',
        createdAt: '2025-04-22T22:16:05.615Z',
        updatedAt: '2025-04-22T22:16:05.615Z'
      }
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
  http.get('http://localhost:3000/api/tournaments/:tournamentId', async ({ params }) => {
    await delay(DELAY)
    const { tournamentId } = params
    return HttpResponse.json(
      {
        id: tournamentId,
        name: 'Torneio 1',
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-01-02T00:00:00.000Z',
        sport: { id: 1, name: 'Futebol' },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      { status: 200 }
    )
  }),
  http.put('http://localhost:3000/api/matches/:matchId', async ({ request, params }) => {
    await delay(DELAY)

    const { matchId } = params
    const { description, date, location, finished, occurrences, roundNumber } = await request.json()

    return HttpResponse.json(
      { id: matchId, description, date, location, finished, occurrences, roundNumber },
      { status: 200 }
    )
  }),
  http.post('http://localhost:3000/api/matches', async ({ request }) => {
    const { description, tournamentId, date, location, roundNumber, occurrences } =
      await request.json()
    return HttpResponse.json(
      { id: 1, description, tournamentId, date, location, roundNumber, occurrences },
      { status: 201 }
    )
  }),
  http.get('http://localhost:3000/api/tournaments/:tournamentId/matches', async ({ params }) => {
    await delay(DELAY)

    const { tournamentId } = params

    return HttpResponse.json([
      {
        id: 1,
        description: 'Partida 1',
        tournamentId: tournamentId,
        date: '2024-01-01T15:30:00.000Z',
        location: 'Location 1',
        finished: false,
        occurrences: 'Occurrences 1',
        roundNumber: 1,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 2,
        description: 'Partida 2',
        tournamentId: tournamentId,
        date: '2024-01-10T12:27:00.000Z',
        location: 'Location 2',
        finished: true,
        occurrences: 'Occurrences 2',
        roundNumber: 2,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ])
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
