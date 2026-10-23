import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' lets the built site open from any folder (or GitHub Pages / Vercel)
export default defineConfig({
  plugins: [react()],
  base: './',
})
