import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/lefthook-site/',
  publicDir: 'public',
  server: {
    watch: {
      followSymlinks: false,
    },
  },
})
