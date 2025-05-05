import EventPage from '../../app/private/events/page'
import { globalHandlers } from '../handlers/global'

export default {
  title: 'Pages/EventPage',
  component: EventPage
}

export const Default = {
  name: 'Event Page',
  args: {},
  parameters: {
    msw: {
      handlers: globalHandlers
    }
  }
}
