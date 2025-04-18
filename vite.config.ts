import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // Configure the server to properly load JSON files
  server: {
    watch: {
      usePolling: true,
    },
  },
  // Make the pins directory accessible during development
  publicDir: 'public',
  // Support for loading JSON files directly
  assetsInclude: ['**/*.json'],
});
