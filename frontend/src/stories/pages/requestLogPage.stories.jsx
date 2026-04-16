import RequestLogPage from '../../app/private/request-logs/page'
import { globalHandlers } from '../handlers/global'

export default {
  title: 'Pages/RequestLogPage',
  component: RequestLogPage
}

export const Default = {
  name: 'Request Log Page',
  args: {},
  parameters: {
    msw: {
      handlers: globalHandlers
    }
  }
}
