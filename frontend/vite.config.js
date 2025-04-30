import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    host: '0.0.0.0',
    strictPort: true,
    // For Replit specifically
    hmr: {
      clientPort: 443,
    },
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    // Allow any file access - for Replit environment
    fs: {
      strict: false,
      allow: ['.'],
    },
    // Open up access to any host
    origin: '*',
    // Remove host restrictions for Replit
    allowedHosts: 'all',
    // Proxy API calls to the backend
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Handle JSX in JS files
  esbuild: {
    loader: 'jsx',
    include: [
      // Include all JS files in src
      'src/**/*.js',
    ],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  // Explicitly set the base path
  base: './',
});