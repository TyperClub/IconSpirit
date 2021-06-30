'use strict';

const OSS = require('ali-oss');
const config = require('../config/oss_config');

const client = new OSS({
  // endpoint: config.endpoint,
  region: config.region,
  internal: true,
  // cname: true,
  // 云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
  accessKeyId: config.accessKeyId,
  accessKeySecret: config.accessKeySecret,
  bucket: config.bucket,
});

module.exports = client;