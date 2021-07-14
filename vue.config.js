const webpack = require("webpack");
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const config = require("./app/config");
const Timestamp = new Date().getTime();
const productionGzipExtensions = ['js', 'css']

module.exports = {
  productionSourceMap: false,
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
          }),
          new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),//匹配文件名
            threshold: 10240,//对10K以上的数据进行压缩
            minRatio: 0.8,
            deleteOriginalAssets:false,//是否删除源文件
        })
      ],
      output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
        filename: `[name].${Timestamp}.js`,
        chunkFilename: `[name].${Timestamp}.js`
      },
  }
}
