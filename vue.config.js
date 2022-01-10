// 'use strict'
// const path = require('path')
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  pages: {
    index: {
      entry: 'example/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
  },
  chainWebpack: (config) => {
    // These are some necessary steps changing the default webpack config of the Vue CLI
    // that need to be changed in order for Typescript based components to generate their
    // declaration (.d.ts) files.
    //
    // Discussed here https://github.com/vuejs/vue-cli/issues/1081
    if (process.env.NODE_ENV === 'production') {
      config.module.rule('ts').uses.delete('cache-loader')
      config.module
        .rule('ts')
        .use('ts-loader')
        .loader('ts-loader')
        .tap((opts) => {
          opts.transpileOnly = false
          opts.happyPackMode = false
          opts.configFile = 'tsconfig.json'
          return opts
        })
      config.externals({
        quill: {
          root: 'Quill',
          commonjs: 'quill',
          commonjs2: 'quill',
          amd: 'quill',
        },
      })
    }
  },
  parallel: false,
})
