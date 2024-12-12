import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['tailwindcss', 'postcss', 'autoprefixer'],
  },
  css: {
    postcss: './postcss.config.cjs',
  },
})
