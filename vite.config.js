import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages: https://<user>.github.io/fit-sup/
  base: '/fit-sup/',
  plugins: [react()],
})
