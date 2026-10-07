import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative asset paths so the built app works under any deployment prefix
  base: './',
  build: {
    // Build straight into the Vue app's public folder so a single Vue build
    // serves both apps under one GitHub Pages URL
    outDir: '../personal-website-vue/public/mushroom-tracker',
    emptyOutDir: true
  }
})