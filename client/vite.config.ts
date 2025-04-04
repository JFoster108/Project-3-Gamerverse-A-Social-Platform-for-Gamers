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
      'Content-Security-Policy': [
        "default-src 'self';",
        "script-src 'self' 'unsafe-inline';",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
        "style-src-elem 'self' https://fonts.googleapis.com;",
        "font-src 'self' https://fonts.gstatic.com data:;",
        "connect-src 'self';",
        "img-src 'self' data:;",
        "object-src 'none';",
        "frame-ancestors 'none';"
      ].join(' ')
    }
  }
})