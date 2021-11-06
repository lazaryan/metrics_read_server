import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    cors: false,
    port: 3001,
    proxy: {
      '/ws': {
        target: 'ws://localhost:3000',
        changeOrigin: true,
        ws: true,
        rewrite: path => path.replace(/^\/ws/, '')
      }
    }
  }
})
