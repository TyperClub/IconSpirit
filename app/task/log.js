const log4js = require('log4js');

log4js.configure({
    replaceConsole: true,
    pm2: true,
    appenders: {
        stdout: {//控制台输出
            type: 'console'
        },
        info: {  //请求转发日志
            type: 'dateFile',    //指定日志文件按时间打印
            filename: 'logs/task/info',  //指定输出文件路径
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
        err: {  //错误日志
            type: 'dateFile',
            filename: 'logs/task/err',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
        oth: {  //其他日志
            type: 'dateFile',
            filename: 'logs/othlog/oth',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true
        }

    },
    categories: {
        //appenders:采用的appender,取appenders项,level:设置级别
        default: { appenders: ['stdout', 'info'], level: 'debug' },
        err: { appenders: ['stdout', 'err'], level: 'error' },
    }
});


exports.getLogger = function (name) {//name取categories项
    return log4js.getLogger(name || 'default')
};