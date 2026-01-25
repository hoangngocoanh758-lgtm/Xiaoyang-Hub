const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 关键修改：配置多页面入口
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      title: '小阳AI工具箱',
      // 网页标题
    },
    // 新增：让 Webpack 额外构建一个 404.html
    // 它使用和 index 一样的入口文件 (src/main.js)
    // 这样当 Cloudflare 加载 404.html 时，实际上是在启动我们的 Vue 应用
    notFound: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: '404.html',
      title: '小阳AI工具箱',
    }
  }
})
