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
            options: {}
        }
    },
    redis: {
        client: {
            port: 6379,          // Redis port
            host: 'tars-redis.staging.zmaxis.com',   // Redis host
            password: 'bC2kNyRH6f8kzEqpM2EV',
            db: 5
        }
    }
};
