import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    proxy: {
      // optional: only for local dev to forward API requests
      '/api': {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
