import MatchPage from '../../app/private/matches/[tournamentId]/page'
import { globalHandlers } from '../handlers/global'

export default {
  title: 'Pages/MatchPage',
  component: MatchPage
}

export const Default = {
  name: 'Match Page',
  parameters: {
    msw: {
      handlers: globalHandlers
    },
    nextjs: {
      navigation: {
        segments: [['tournamentId', '1']]
      }
    }
  }
}
