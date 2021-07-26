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
            url: consulConfig.mongoose.url,
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
        client: consulConfig.redis
    },
    logger: {
        dir: '/opt/logs/13654/applog',
        coreLogName: 'info.log',
        errorLogName: 'error.log',
    },
};
