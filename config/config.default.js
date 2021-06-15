/* eslint valid-jsdoc: "off" */

'use strict';

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
    domainWhiteList: [ 'http://localhost:3000' ]
  };

    // 加密盐
  config.pwd_salt = 'egg-api-salt';

    // jsonwebtoken
  config.jwt = {
    secret: 'egg-api-jwt',
  };

  config.cors = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};

