'use strict';
const { consulConfig } = require("./consulConfig")

const OSS_local =  {
  website: "", //阿里云 bucket 绑定的域名
  region: "",
  accessKeyId: "",
  accessKeySecret: "",
  bucket: "",
  cname: true,
  path: ""
}

const OSS_fat = {
  website: "",
  region: "",
  accessKeyId: "",
  accessKeySecret: "",
  bucket: "",
  cname: true,
  path: ""
}

if(consulConfig && consulConfig.oss){//取得 consul 配置，走默认配置
  OSS_local = consulConfig.oss.local
  OSS_fat = consulConfig.oss.fat
}

module.exports = {
  local: OSS_local,
  fat: OSS_fat
};