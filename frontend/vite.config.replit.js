import { defineConfig } from 'vite';
import { readFileSync } from 'fs';

// This is a special Replit-specific configuration file that will be used
// when Vite is running on Replit. It enables special settings for Replit.

export default defineConfig({
  server: {
    hmr: {
      clientPort: 443, // Important for Replit
    },
    watch: {
      usePolling: true, // Needed for file changes in Replit
    },
    cors: true,
  },
  // These settings help Vite work better in Replit
  clearScreen: false,
  optimizeDeps: {
    force: true,
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    minify: 'terser',
  },
});