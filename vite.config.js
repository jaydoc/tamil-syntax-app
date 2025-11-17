import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // your repo name here
  base: '/tamil-syntax-app/',
  build: {
    outDir: 'docs',
  },
})
