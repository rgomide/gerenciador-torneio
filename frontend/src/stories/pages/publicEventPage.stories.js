import PublicEventPage from '../../app/public/event/[eventId]/page'
import {
  publicEventPageHandlersEmptyMatches,
  publicEventPageHandlersFull,
  publicEventPageHandlersNotFound,
  STORY_PUBLIC_EVENT_ID
} from '../handlers/publicEventPage.handlers'

const nextNavigation = {
  segments: [['eventId', STORY_PUBLIC_EVENT_ID]]
}

export default {
  title: 'Pages/PublicEventPage',
  component: PublicEventPage
}

export const Default = {
  name: 'Evento com torneios e partidas',
  args: {},
  parameters: {
    msw: {
      handlers: publicEventPageHandlersFull
    },
    nextjs: {
      navigation: nextNavigation
    }
  }
}

export const SemPartidas = {
  name: 'Evento sem partidas',
  args: {},
  parameters: {
    msw: {
      handlers: publicEventPageHandlersEmptyMatches
    },
    nextjs: {
      navigation: nextNavigation
    }
  }
}

export const EventoNaoEncontrado = {
  name: 'Evento não encontrado (404)',
  args: {},
  parameters: {
    msw: {
      handlers: publicEventPageHandlersNotFound
    },
    nextjs: {
      navigation: nextNavigation
    }
  }
}
