// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'src', // Dice a Vite che i nostri file sorgente sono nella cartella 'src'
  server: {
    port: 5177, // Porta fissa per evitare conflitti
    host: 'localhost'
  },
});
