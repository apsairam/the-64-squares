import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const siteUrl = (process.env.SITE_URL || 'http://localhost:4000').replace(
  /\/$/,
  ''
);

export default defineConfig({
  plugins: [react()],
  define: {
    __SITE_URL__: JSON.stringify(siteUrl),
  },
  server: {
    port: 5173,
    // Allow the temporary share tunnels used for live reviews.
    allowedHosts: ['.loca.lt', '.ngrok-free.app', '.ngrok.io', '.trycloudflare.com'],
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
