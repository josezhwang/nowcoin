import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': process.env.API_URL ?? 'http://localhost:4000',
    },
  },
  build: {
    // three.js + postprocessing is inherently ~1.1 MB; it is split into its own cacheable chunk.
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: (id) => (/node_modules\/(three|@react-three|postprocessing)\//.test(id) ? 'three' : undefined),
      },
    },
  },
})
