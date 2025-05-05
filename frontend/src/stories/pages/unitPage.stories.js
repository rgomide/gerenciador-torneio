import UnitPage from '../../app/private/units/[institutionId]/page'
import { globalHandlers } from '../handlers/global'

export default {
  title: 'Pages/UnitPage',
  component: UnitPage
}

export const Default = {
  name: 'Unit Page',
  parameters: {
    msw: {
      handlers: globalHandlers
    },
    nextjs: {
      navigation: {
        segments: [['institutionId', '1']]
      }
    }
  }
}
