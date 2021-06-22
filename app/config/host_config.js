'use strict';

const OA_HOST = {
  dev: 'http://fe.zmaxis.com:8080',
  fat: 'http://fe.zmaxis.com:8080',
  // UAT 环境目前不通
  uat: 'http://open.uat.zmops.cc',
  prod: 'http://open-ng.zmlearn.com',
};

// 部门信息来自 发布系统数据
const OPS_HOST = {
  // http://10.47.75.110:8000 原先使用 IP
  dev: 'http://cmdb02.zmops.cc',
  fat: 'http://cmdb02.zmops.cc',
  uat: 'http://cmdb02.zmops.cc',
  prod: 'http://cmdb02-ng.zmops.cc',
};


module.exports = {
  OA_HOST,
  OPS_HOST
};
