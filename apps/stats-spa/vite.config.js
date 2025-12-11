import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true
      },
      include: ['buffer', 'process', 'util']
    })
  ],
  server: {
    hmr: {
      host: 'localhost',
      port: 5173
    },
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        changeOrigin: true,
        logLevel: 'debug',
        secure: false,
        target: process.env.VITE_API_URL || 'http://172.18.0.4',
        ws: true
      }
    }
  }
});
