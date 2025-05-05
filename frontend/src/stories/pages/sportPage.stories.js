import SportPage from '../../app/private/sports/page'
import { globalHandlers } from '../handlers/global'

export default {
  title: 'Pages/SportPage',
  component: SportPage
}

export const Default = {
  name: 'Sport Page',
  args: {},
  parameters: {
    msw: {
      handlers: globalHandlers
    }
  }
}
