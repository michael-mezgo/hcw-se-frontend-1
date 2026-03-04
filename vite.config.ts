import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
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
