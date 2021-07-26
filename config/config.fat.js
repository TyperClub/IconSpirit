'use strict';

module.exports = {
    cluster: {
        listen: {
            port: 8080,
        }
    },
    mongoose: {
        client: {
            url: 'mongodb://127.0.0.1:27017/ops-iconfont',
            options: {
                useNewUrlParser: true,
                autoReconnect: true,
                reconnectTries: Number.MAX_VALUE,
                bufferMaxEntries: 0,
                family: 4,
            }
        }
    },
    redis: {
        client: {}
    },
    logger: {
        dir: '/opt/logs/13654/applog',
        coreLogName: 'info.log',
        errorLogName: 'error.log',
    },
};
