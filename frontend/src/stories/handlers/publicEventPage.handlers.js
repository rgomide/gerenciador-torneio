import { delay, http, HttpResponse } from 'msw'

const API_BASE = 'http://localhost:3000/api'
const DELAY_MS = 160

/** ID usado nas stories — deve coincidir com `segments` no nextjs.navigation */
export const STORY_PUBLIC_EVENT_ID = 'evt-jifs-floripa-2026'

const created = '2026-05-20T18:30:00.000Z'
const updated = '2026-09-10T14:22:00.000Z'

/** Evento completo: calendário próximo de jogos institucionais reais */
export const mockPublicEventFull = {
  id: STORY_PUBLIC_EVENT_ID,
  name: 'JIFS Sul 2026 — Etapa Florianópolis',
  startDate: '2026-09-08T03:00:00.000Z',
  endDate: '2026-09-12T03:00:00.000Z',
  unitName: 'Campus Florianópolis — Reitoria',
  institutionName: 'Instituto Federal de Santa Catarina'
}

/** Mesmo evento, sem partidas (lista vazia) */
export const mockPublicEventEmpty = {
  ...mockPublicEventFull,
  name: 'Copa Integração — edição piloto (sem jogos ainda)'
}

/**
 * Partidas alinhadas ao formato de GET /api/public/events/:eventId/matches
 * (MatchVO + tournamentName, tournamentFinished, sportName, snapshot?, participants?)
 */
export const mockPublicMatchesFull = [
  {
    id: 8801,
    tournamentId: 501,
    tournamentName: 'Vôlei de praia — feminino',
    tournamentFinished: false,
    sportName: 'Vôlei de praia',
    snapshot: null,
    participants: [
      { participantType: 'team', name: 'IFSC / Araranguá' },
      { participantType: 'team', name: 'IFSC / Tubarão' }
    ],
    date: '2026-09-09T17:30:00.000Z',
    description: 'Semifinal — melhor de 3 sets',
    location: 'Arena de areia — Setor B',
    finished: true,
    occurrences: 'Sets: 21×18, 19×21, 15×12',
    roundNumber: 2,
    totalScores: [
      { id: '41', name: 'IFSC / Araranguá', totalScore: 2 },
      { id: '42', name: 'IFSC / Tubarão', totalScore: 1 }
    ],
    createdAt: created,
    updatedAt: updated
  },
  {
    id: 8802,
    tournamentId: 501,
    tournamentName: 'Vôlei de praia — feminino',
    tournamentFinished: false,
    sportName: 'Vôlei de praia',
    snapshot: null,
    participants: [
      { participantType: 'team', name: 'IFSC / Canoinhas' },
      { participantType: 'team', name: 'IFSC / São José' }
    ],
    date: '2026-09-10T19:00:00.000Z',
    description: 'Final — aguardando adversária da outra chave',
    location: 'Arena de areia — Setor B',
    finished: false,
    occurrences: null,
    roundNumber: 3,
    totalScores: [],
    createdAt: created,
    updatedAt: updated
  },
  {
    id: 8803,
    tournamentId: 502,
    tournamentName: 'Futsal — masculino',
    tournamentFinished: true,
    sportName: 'Futsal',
    snapshot: {
      matchId: 8803,
      matchDate: '2026-09-08T21:15:00.000Z',
      matchLocation: 'Ginásio poliesportivo — quadra 1',
      matchRoundNumber: 4,
      matchOccurrences: 'Prorrogação: 1×0',
      tournamentId: 502,
      tournamentName: 'Futsal — masculino',
      tournamentStartDate: '2026-09-07T03:00:00.000Z',
      tournamentEndDate: '2026-09-08T03:00:00.000Z',
      tournamentFinished: true,
      eventId: STORY_PUBLIC_EVENT_ID,
      eventName: mockPublicEventFull.name,
      eventStartDate: mockPublicEventFull.startDate,
      eventEndDate: mockPublicEventFull.endDate,
      unitId: 12,
      unitName: 'Campus Florianópolis — Reitoria',
      institutionId: 3,
      institutionName: 'Instituto Federal de Santa Catarina',
      sportId: 7,
      sportName: 'Futsal',
      matchParticipants: [
        { id: '201', participantType: 'team', name: 'Atlética Engenharia IFSC' },
        { id: '202', participantType: 'team', name: 'Atlética Agronomia IFSC' }
      ],
      matchScores: [
        {
          id: '201',
          participantType: 'team',
          name: 'Atlética Engenharia IFSC',
          score: 3,
          details: '1º tempo'
        },
        {
          id: '202',
          participantType: 'team',
          name: 'Atlética Agronomia IFSC',
          score: 2,
          details: '1º tempo'
        },
        {
          id: '201',
          participantType: 'team',
          name: 'Atlética Engenharia IFSC',
          score: 2,
          details: '2º tempo'
        },
        {
          id: '202',
          participantType: 'team',
          name: 'Atlética Agronomia IFSC',
          score: 1,
          details: '2º tempo'
        }
      ],
      totalScores: [
        { id: '201', name: 'Atlética Engenharia IFSC', totalScore: 5 },
        { id: '202', name: 'Atlética Agronomia IFSC', totalScore: 3 }
      ],
      snapshotTakenAt: '2026-09-08T22:48:33.000Z'
    },
    participants: undefined,
    date: '2026-09-08T21:15:00.000Z',
    description: 'Grande final',
    location: 'Ginásio poliesportivo — quadra 1',
    finished: true,
    occurrences: 'Prorrogação: 1×0',
    roundNumber: 4,
    totalScores: null,
    createdAt: created,
    updatedAt: updated
  },
  {
    id: 8804,
    tournamentId: 503,
    tournamentName: 'Xadrez — rápido (10+5)',
    tournamentFinished: true,
    sportName: 'Xadrez',
    snapshot: null,
    participants: [
      { participantType: 'player', name: 'Marina Duarte' },
      { participantType: 'player', name: 'Pedro Henrique Azevedo' }
    ],
    date: '2026-09-07T14:00:00.000Z',
    description: 'Decisão — mesa 12',
    location: 'Biblioteca — salão de eventos',
    finished: true,
    occurrences: 'Empate nas partidas rápidas; desempate: armageddon',
    roundNumber: 5,
    totalScores: [
      { id: '501', name: 'Marina Duarte', totalScore: 4.5 },
      { id: '502', name: 'Pedro Henrique Azevedo', totalScore: 3.5 }
    ],
    createdAt: created,
    updatedAt: updated
  }
]

function publicEventGetHandler({ event, status = 200 }) {
  return http.get(`${API_BASE}/public/events/:eventId`, async () => {
    await delay(DELAY_MS)
    if (status === 404) {
      return HttpResponse.json({ message: 'Evento não encontrado' }, { status: 404 })
    }
    return HttpResponse.json(event)
  })
}

function publicEventMatchesHandler({ matches, status = 200 }) {
  return http.get(`${API_BASE}/public/events/:eventId/matches`, async () => {
    await delay(DELAY_MS)
    if (status === 404) {
      return HttpResponse.json({ message: 'Evento não encontrado' }, { status: 404 })
    }
    return HttpResponse.json(matches)
  })
}

/** Torneios em andamento + encerrados, insights e snapshots */
export const publicEventPageHandlersFull = [
  publicEventGetHandler({ event: mockPublicEventFull }),
  publicEventMatchesHandler({ matches: mockPublicMatchesFull })
]

/** Evento encontrado, sem partidas */
export const publicEventPageHandlersEmptyMatches = [
  publicEventGetHandler({ event: mockPublicEventEmpty }),
  publicEventMatchesHandler({ matches: [] })
]

/** 404 no evento (as duas rotas falham como no backend) */
export const publicEventPageHandlersNotFound = [
  publicEventGetHandler({ status: 404 }),
  publicEventMatchesHandler({ status: 404 })
]
