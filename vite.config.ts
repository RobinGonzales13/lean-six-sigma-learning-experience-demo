import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/lean-six-sigma-learning-experience-demo/',
  plugins: [react()],
})
