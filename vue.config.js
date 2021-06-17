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
  }
}
