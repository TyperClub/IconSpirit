'use strict';

module.exports = {
    cluster: {
        listen: {
            port: 8080,
        }
    },
    mongoose: {
        client: {
            url: '',
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
