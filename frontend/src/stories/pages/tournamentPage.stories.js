import { delay, http, HttpResponse } from 'msw'
import TournamentPage from '../../app/private/tournaments/page'
import { globalHandlers } from '../handlers/global'

export default {
  title: 'Pages/TournamentPage',
  component: TournamentPage
}

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
      handlers: globalHandlers
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
