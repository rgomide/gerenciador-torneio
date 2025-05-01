import InstitutionPage from '../../app/private/institutions/page'
import { globalHandlers } from '../handlers/global'

export default {
  title: 'Pages/InstitutionPage',
  component: InstitutionPage
}

export const Default = {
  name: 'Institution Page',
  args: {},
  parameters: {
    msw: {
      handlers: globalHandlers
    }
  }
}
