import { defineConfig } from 'vite'

// Minimal Vite config without plugin to avoid version conflicts
export default defineConfig(()=>({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
}))
