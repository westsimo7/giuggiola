import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: served at the repo subpath on GitHub Pages (/giuggiola/) in build,
// but kept at "/" for local `npm run dev`.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/giuggiola/' : '/',
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true,
  },
}))
