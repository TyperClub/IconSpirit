'use strict';
const { consulConfig } = require("./consulConfig")

const DEFAULT_CONFIG = {
  ldapOpts: {
    url: '',
  },
  adminDn: "",
  adminPassword: "",
  userSearchBase: "",
  usernameAttribute: "",
  username: '',
  userPassword: '',
};

if(consulConfig && consulConfig.ldap){//取到 consul 配置，走 consul 配置
  DEFAULT_CONFIG = {
    ...DEFAULT_CONFIG,
    ...consulConfig.ldap
  } 
}

module.exports = {
  local: ({ username, password }) => {
    DEFAULT_CONFIG.ldapOpts.url = 'ldap://10.142.168.88:3268';
    DEFAULT_CONFIG.username = username;
    DEFAULT_CONFIG.userPassword = password;

    return DEFAULT_CONFIG;
  },
  dev: ({ username, password }) => {
    DEFAULT_CONFIG.ldapOpts.url = 'ldap://10.142.168.88:3268';
    DEFAULT_CONFIG.username = username;
    DEFAULT_CONFIG.userPassword = password;

    return DEFAULT_CONFIG;
  },
  fat: ({ username, password }) => {
    DEFAULT_CONFIG.ldapOpts.url = 'ldap://10.142.168.88:3268';
    DEFAULT_CONFIG.username = username;
    DEFAULT_CONFIG.userPassword = password;

    return DEFAULT_CONFIG;
  },
};
