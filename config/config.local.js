exports.mongoose = {
    client: {
        url: 'mongodb://127.0.0.1:27017/ops-iconfont',
        options: {}
    }
}

exports.redis = {
    client: {
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      password: 'cc',
      db: 0
    }
}

exports.baseUrl = 'http://127.0.0.1:7001';