import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // seu servidor Flask
        changeOrigin: true,
        secure: false,
        headers: {
          Host: 'localhost:5173' // Garante que o Flask pense que está na porta 5173
      }
      },
    },
  },
})
