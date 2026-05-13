import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/lefthook-site/' : '/',
  publicDir: 'public',
  server: {
    watch: {
      followSymlinks: false,
    },
  },
}))
