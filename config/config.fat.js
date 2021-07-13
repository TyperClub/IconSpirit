'use strict';

module.exports = {
    cluster: {
        listen: {
            port: 8080,
        }
    },
    mongoose: {
        client: {
            url: 'mongodb://ops_iconfont_rw:pmoKstulRzgTsj0r@dds-bp1964edfcdd60741.mongodb.rds.aliyuncs.com:3717,dds-bp1964edfcdd60742.mongodb.rds.aliyuncs.com:3717/ops_iconfont?replicaSet=mgset-35904809',
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
