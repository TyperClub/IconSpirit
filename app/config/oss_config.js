'use strict';
const { consulConfig } = require("./consulConfig")

let OSS_local, OSS_fat

if(!consulConfig){//未取得 consul 配置，走默认配置
 OSS_local =  {
    website: "",
    region: "",
    accessKeyId: "",
    accessKeySecret: "",
    bucket: "",
    cname: true,
    path: ""
  }
  OSS_fat = {
    website: "",
    region: "",
    accessKeyId: "",
    accessKeySecret: "",
    bucket: "",
    cname: true,
    path: ""
  }
}else{
  OSS_local = consulConfig.oss.local
  OSS_fat = consulConfig.oss.fat
}

module.exports = {
  local: OSS_local,
  fat: OSS_fat
};