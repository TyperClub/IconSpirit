'use strict';

const DEFAULT_CONFIG = {
  ldapOpts: {
    url: '',
  },
  adminDn: 'CN=ldaposs,OU=掌门集团,DC=zmdesk,DC=com',
  adminPassword: 'Aa123456',
  userSearchBase: 'DC=zmdesk,DC=com',
  usernameAttribute: 'SamAccountName',
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
