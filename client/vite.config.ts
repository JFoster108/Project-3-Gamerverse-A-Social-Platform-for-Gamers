// client/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
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
      ].join(' ')
    }
  }
});
