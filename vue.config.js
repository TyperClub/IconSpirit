const webpack = require("webpack");
const Timestamp = new Date().getTime();

module.exports = {
  devServer: {
    proxy: { // 配置跨域处理 可以设置多个
      '/api': {
        target: 'http://127.0.0.1:7001/',//跨域请求头信息
        changeOrigin: true,
        ws: false,
        secure: false, // 如果是https接口，需要配置这个参数
      }
    }
  },
  configureWebpack: {
      //支持jquery
      plugins: [
          new webpack.ProvidePlugin({
              $:"jquery",
              jQuery:"jquery",
              "windows.jQuery":"jquery"
          })
      ]
  },
  configureWebpack: { // webpack 配置
    output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
      filename: `[name].${Timestamp}.js`,
      chunkFilename: `[name].${Timestamp}.js`
    },
  }
}
