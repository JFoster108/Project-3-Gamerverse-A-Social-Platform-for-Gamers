import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/graphql': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    },
    headers: {
      'Content-Security-Policy': 
        "default-src 'self'; font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https:"
    }
  }
})