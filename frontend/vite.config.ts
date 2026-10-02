import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    proxy: {
      '/api': process.env.API_URL ?? 'http://127.0.0.1:4000',
    },
  },
  preview: {
    // `npm run share` serves the build with `vite preview`. Vite otherwise answers any
    // host name other than an IP/localhost with 403 "Blocked request" (easily mistaken
    // for a CORS error), which breaks tunnels (Cloudflare, ngrok, Tailscale) and dynamic
    // DNS names. Preview only serves the public build, so any host is fine; the dev
    // server keeps Vite's strict check.
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks cache independently of app code.
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules\/(react|react-dom|react-router|scheduler)\//.test(id)) return 'react'
          if (/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(id)) return 'motion'
          return undefined
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
