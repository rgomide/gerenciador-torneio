import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import './app/globals.css'

/** Prefer Vite `base`; if build used `/` but the app is served under `/app`, infer from the URL */
function routerBasename() {
  const fromVite = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/'
  if (fromVite !== '/') return fromVite
  if (typeof window === 'undefined') return '/'
  const first = window.location.pathname.split('/').filter(Boolean)[0]
  return first === 'app' ? '/app' : '/'
}

const basename = routerBasename()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
)
