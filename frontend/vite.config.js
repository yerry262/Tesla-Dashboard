import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3033,
    proxy: {
      '/api': {
        target: 'http://localhost:3034',
        changeOrigin: true
      },
      '/auth': {
        target: 'http://localhost:3034',
        changeOrigin: true
      },
      '/Tesla-Dashboard/callback': {
        target: 'http://localhost:3034',
        changeOrigin: true
      }
    }
  }
})
