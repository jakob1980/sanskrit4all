// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5177, // Porta fissa
    host: 'localhost'
  },
  build: {
    outDir: 'dist', // Build nella cartella corrente
    emptyOutDir: true,
  }
});
