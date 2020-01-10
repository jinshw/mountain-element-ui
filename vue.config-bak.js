const glob = require('glob')

'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
const port = 9528 // dev port

// 配置pages多页面获取当前文件夹下的html和js
function getEntry(globPath) {
  const entries = {}; let tmp; const htmls = {}

  // 读取src/pages/**/底下所有的html文件
  glob.sync(globPath + 'html').forEach(function(entry) {
    tmp = entry.split('/').splice(-3)
    htmls[tmp[1]] = entry
  })

  // 读取src/pages/**/底下所有的js文件
  glob.sync(globPath + 'js').forEach(function(entry) {
    tmp = entry.split('/').splice(-3)
    entries[tmp[1]] = {
      entry,
      template: htmls[tmp[1]] ? htmls[tmp[1]] : 'index.html', //  当前目录没有有html则以共用的public/index.html作为模板
      filename: tmp[1] + '.html' //  以文件夹名称.html作为访问地址
    }
  })
  console.log(entries)
  return entries
}
const pages = getEntry('./src/pages/**/*.')

module.exports = {
  pages: pages,
  publicPath: '/mt/', //  解决打包之后静态文件路径404的问题
  outputDir: 'dist', //  打包后的文件夹名称，默认dist
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    // open: true,//在这里配置，运行npm run dev时会打开2次页面，改为在package.json中添加--open配置
    overlay: {
      warnings: false,
      errors: true
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
        }
      )
  }
}
