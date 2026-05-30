import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configured for remote/proxied dev environments (e.g. Claude Code on the web):
// - host: true   → listen on 0.0.0.0 so the preview proxy can reach the server
// - allowedHosts → don't 403 requests coming through the proxy's hostname
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true,
  },
})
