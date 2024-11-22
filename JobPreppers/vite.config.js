import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from 'tailwindcss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader:
     { '.js': 'jsx' },
  },
  build: {
    rollupOptions: {
      input: './src/index.js', // Set the entry point to index.js
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()], 
    },
  }
})
