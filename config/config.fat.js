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
        client: {
            port: 6379,          // Redis port
            host: 'tars-redis.staging.zmaxis.com',   // Redis host
            password: 'bC2kNyRH6f8kzEqpM2EV',
            db: 5
        }
    },
    logger: {
        dir: '/opt/logs/13654/applog',
        coreLogName: 'info.log',
        errorLogName: 'error.log',
    },
};
