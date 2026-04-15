import PublicEventPage from '../../app/public/event/[eventId]/page'
import {
  publicEventPageHandlersEmptyMatches,
  publicEventPageHandlersFull,
  publicEventPageHandlersNotFound,
  STORY_PUBLIC_EVENT_ID
} from '../handlers/publicEventPage.handlers'

export default {
  title: 'Pages/PublicEventPage',
  component: PublicEventPage
}

export const Default = {
  name: 'Evento com torneios e partidas',
  parameters: {
    msw: {
      handlers: publicEventPageHandlersFull
    },
    nextjs: {
      navigation: {
        segments: [['eventId', STORY_PUBLIC_EVENT_ID]]
      }
    }
  }
}

export const SemPartidas = {
  name: 'Evento sem partidas',
  parameters: {
    msw: {
      handlers: publicEventPageHandlersEmptyMatches
    },
    nextjs: {
      navigation: {
        segments: [['eventId', STORY_PUBLIC_EVENT_ID]]
      }
    }
  }
}

export const EventoNaoEncontrado = {
  name: 'Evento não encontrado (404)',
  parameters: {
    msw: {
      handlers: publicEventPageHandlersNotFound
    },
    nextjs: {
      navigation: {
        segments: [['eventId', STORY_PUBLIC_EVENT_ID]]
      }
    }
  }
}
