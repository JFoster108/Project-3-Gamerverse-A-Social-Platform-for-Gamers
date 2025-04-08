import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Update this to the actual backend API URL on your server or Render
        changeOrigin: true,
        secure: false,
      },
    },
    headers: {
      'Content-Security-Policy': [
        "default-src 'self';",
        "script-src 'self' 'unsafe-inline';",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
        "font-src 'self' https://fonts.gstatic.com data:;",
        "connect-src 'self' https://api.rawg.io;",
        "img-src 'self' data: https://media.rawg.io https://via.placeholder.com;",
        "object-src 'none';",
        "frame-ancestors 'none';"
      ].join(' '),
    },
  },
});
