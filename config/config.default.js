/* eslint valid-jsdoc: "off" */

'use strict';

const path = require("path")

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1606821624608_7849';

  // add your middleware config here
    // add your config here
  config.middleware = [
      'errorHandler',
      'jwt',
  ];

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    },
    // 允许访问接口的白名单
    domainWhiteList: [ '*' ], // 白名单
  };

  config.cors = {
    origin: '*', // 匹配规则  域名+端口  *则为全匹配
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

    // 加密盐
  config.pwd_salt = 'egg-api-salt';

    // jsonwebtoken
  config.jwt = {
    secret: 'egg-api-jwt',
  };

  config.session = {
    key: 'OPS',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: true,
  };

  config.cors = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  config.bodyParser = {
		formLimit: '30mb',
	  jsonLimit: '30mb',
	  textLimit: '30mb'
	}

  config.multipart = {
    mode: 'file',
    fileSize: '10mb',
    tmpdir: path.join("tmp", 'egg-multipart-tmp', appInfo.name),
    cleanSchedule: {
      cron: '0 30 4 * * *',
    },
    fileExtensions: [ '.svg'],
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};

