import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

// import path from 'path'

export default defineConfig({
  // root: path.join(__dirname, '/'),

  // build: {
  //   outDir: path.join(__dirname, 'docs')
  // },

  plugins: [ createVuePlugin() ],

  server: { port: 8080 }
})
