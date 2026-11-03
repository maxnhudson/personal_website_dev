import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// PUBLIC_PATH matches the name the deploy workflow already passes, so
// deploying under a subpath stays a one-variable change:
//   PUBLIC_PATH=/personal_website_dev/ npm run build
const publicPath = process.env.PUBLIC_PATH || '/'

export default defineConfig({
  plugins: [vue()],
  // Vite calls this `base`; it replaces vue-cli's `publicPath`
  base: publicPath,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})