'use strict';
const { consulConfig } = require("./consulConfig")

const DEFAULT_CONFIG = {
  ldapOpts: {
    url: '',
  },
  adminDn: consulConfig.ldap?.adminDn,
  adminPassword: consulConfig.ldap?.adminPassword,
  userSearchBase: consulConfig.ldap?.userSearchBase,
  usernameAttribute: consulConfig.ldap?.usernameAttribute,
  username: '',
  userPassword: '',
};

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
    DEFAULT_CONFIG.ldapOpts.url = 'ldap://ad.zmaxis.com:3268';
    DEFAULT_CONFIG.username = username;
    DEFAULT_CONFIG.userPassword = password;

    return DEFAULT_CONFIG;
  },
  prod: ({ username, password }) => {
    DEFAULT_CONFIG.ldapOpts.url = 'ldap://ad.zmaxis.com:3268';
    DEFAULT_CONFIG.username = username;
    DEFAULT_CONFIG.userPassword = password;

    return DEFAULT_CONFIG;
  },
};
