import PlayerPage from '../../app/private/players/page'
import { globalHandlers } from '../handlers/global'

export default {
  title: 'Pages/PlayerPage',
  component: PlayerPage
}

export const Default = {
  name: 'Player Page',
  args: {},
  parameters: {
    msw: {
      handlers: globalHandlers
    }
  }
}
