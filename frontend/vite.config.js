import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/** Same as Vite `base` — must match Express mount (e.g. app.use('/app', static(...))). Override with VITE_BASE_PATH */
function appBasePath() {
  const raw = process.env.VITE_BASE_PATH ?? '/app/'
  if (raw === '/') return '/'
  const s = raw.startsWith('/') ? raw : `/${raw}`
  return s.endsWith('/') ? s : `${s}/`
}

const base = appBasePath()

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'spa-html-base',
      transformIndexHtml(html) {
        if (base === '/' || /<base[\s>]/i.test(html)) return html
        return html.replace('<head>', `<head>\n    <base href="${base}" />`)
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: '../backend/public',
    minify: true,
    manifest: true
  },
  server: {
    port: 3001
  }
})
