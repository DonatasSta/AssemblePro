import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // if you used absolute imports in CRA, e.g. '@/components'
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    // if you had CRA proxy, e.g. "/api" → your backend
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
