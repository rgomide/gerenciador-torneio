import UsersPage from '../../app/private/users/page'
import { globalHandlers } from '../handlers/global'

export default {
  title: 'Pages/UsersPage',
  component: UsersPage
}

export const Default = {
  name: 'Users Page',
  args: {},
  parameters: {
    msw: {
      handlers: globalHandlers
    }
  }
}
