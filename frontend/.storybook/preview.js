import { initialize, mswLoader } from 'msw-storybook-addon'
import '../src/app/globals.css'

initialize()

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  loaders: [mswLoader]
}

export default preview
