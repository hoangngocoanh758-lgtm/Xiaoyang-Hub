const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vue: {
            test: /[\\/]node_modules[\\/]vue[\\/]/,
            name: 'chunk-vue',
            priority: 20,
            chunks: 'all'
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'chunk-vendors',
            priority: -10,
            chunks: 'all'
          }
        }
      }
    }
  },
  devServer: {
    port: 8080,
    open: true,
    historyApiFallback: true
  }
})
