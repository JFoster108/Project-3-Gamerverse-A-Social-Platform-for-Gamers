// client/vite.config.ts
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
        "script-src 'self' 'unsafe-inline';", // Allows inline scripts and those loaded from the same origin
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;", // Consolidated style-src includes inline styles and Google Fonts
        "font-src 'self' https://fonts.gstatic.com data:;", // Allows fonts to be loaded from Google CDN and data URLs
        "connect-src 'self' https://api.rawg.io;", // Allow connections to RAWG API
        "img-src 'self' data: https://media.rawg.io https://via.placeholder.com;", // Allow images from RAWG and placeholder services
        "object-src 'none';", // Prevents object, embed, and applet elements from loading external resources
        "frame-ancestors 'none';" // Disallows embedding the page in frames (Clickjacking protection)
      ].join(' ')
    }
  }
});