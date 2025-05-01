import TeamPage from '../../app/private/teams/page'
import { globalHandlers } from '../handlers/global'

export default {
  title: 'Pages/TeamPage',
  component: TeamPage
}

export const Default = {
  name: 'Team Page',
  args: {},
  parameters: {
    msw: {
      handlers: globalHandlers
    }
  }
}
