'use strict';

const { consulConfig } = require("../app/config/consulConfig")

module.exports = {
    cluster: {
        listen: {
            port: 8080,
        }
    },
    mongoose: {
        client: {
            url: consulConfig ? consulConfig.mongoose.url : "mongodb://127.0.0.1:27017/ops-iconfont",
            options: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                autoReconnect: true,
                reconnectTries: Number.MAX_VALUE,
                bufferMaxEntries: 0,
                family: 4,
            }
        }
    },
    redis: {
        client: consulConfig ? consulConfig.redis : {
            port: 6379,          // Redis port
            host: '127.0.0.1',   // Redis host
            password: 'cc',
            db: 0
        }
    },
    logger: {
        dir: 'logs',
        coreLogName: 'info.log',
        errorLogName: 'error.log',
    },
};
