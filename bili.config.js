'use strict'

const vue = require('rollup-plugin-vue')
// const autoprefixer = require('autoprefixer')

module.exports = {
  js: 'buble',
  input: 'src/Index.vue',
  format: [ 'es', 'cjs', 'umd' ],
  plugins: [
    vue({
      css: true,
      style: {
        trim: false,
        // postcssPlugins: [
        //   autoprefixer({ browsers: [ '> 0.000001%' ] })
        // ]
      }
    })
  ]
}
