import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// This function allows us to load and merge configurations
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  // Load env variables
  const env = loadEnv(mode, process.cwd());
  const isReplit = process.env.REPL_ID !== undefined;
  
  // Base configuration
  const config = {
    plugins: [react()],
    server: {
      port: 5000,
      host: '0.0.0.0',
      strictPort: true,
      hmr: {
        clientPort: 443, // Important for Replit
      },
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // Configure esbuild to handle .js files as JSX
    esbuild: {
      loader: 'jsx',
      include: [
        // Tell esbuild to process JS files with JSX in them
        './src/**/*.js',
      ],
      exclude: [],
    },
    // Optimize dependencies with JSX processing for .js files
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    // Define environment variables
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
  };

  console.log('Running Vite on Replit:', isReplit);
  
  // Special config for Replit
  if (isReplit) {
    config.server.hmr = {
      clientPort: 443,
      host: '0.0.0.0',
    };
    config.server.cors = true;
    config.server.fs = {
      strict: false,
      allow: ['.'],
    };
    config.server.watch = {
      usePolling: true,
    };
    // This setting helps with Replit domain hosting
    config.server.allowedHosts = 'all';
  }
  
  return config;
});