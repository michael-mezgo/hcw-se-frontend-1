import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8080',
        bypass: (req) => req.headers.accept?.includes('text/html') ? '/index.html' : undefined,
      },
      '/users': {
        target: 'http://localhost:8080',
        bypass: (req) => req.headers.accept?.includes('text/html') ? '/index.html' : undefined,
      },
      '/admin': {
        target: 'http://localhost:8080',
        bypass: (req) => req.headers.accept?.includes('text/html') ? '/index.html' : undefined,
      },
      '/cars': {
        target: 'http://localhost:8080',
        bypass: (req) => req.headers.accept?.includes('text/html') ? '/index.html' : undefined,
      },
    },
  },
  optimizeDeps: {
    include: ['@cypress/code-coverage/support'],
  },
  plugins: [
    tailwindcss(),
    react(),
    istanbul({
      include: 'src/**',
      exclude: ['node_modules', 'cypress'],
      extension: ['.ts', '.tsx'],
      cypress: true,
    }),
  ],
})
