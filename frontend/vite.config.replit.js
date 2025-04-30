import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Special configuration for Replit environment
export default defineConfig({
  plugins: [react()],
  server: {
    // Basic server settings
    port: 5000,
    host: '0.0.0.0',
    strictPort: true,
    // Replit-specific settings
    hmr: {
      // force client port to 443 so that Replit can proxy websockets
      clientPort: 443,
    },
    // Maximum access configuration
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    cors: {
      origin: '*',
    },
    // Disable host checking entirely for Replit
    middlewareMode: 'html',
  },
  // Handle JSX in JS files
  esbuild: {
    loader: 'jsx',
    include: [
      // Include all JS files in src
      'src/**/*.js',
    ],
  },
  // Explicitly set the base path
  base: './',
  // Specific option for Replit's hostname issue
  experimental: {
    renderBuiltUrl: (filename, { hostId, hostType, type }) => {
      return filename;
    },
  },
});