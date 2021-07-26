'use strict';
const { consulConfig } = require("./consulConfig")

module.exports = {
  local: consulConfig.oss.local,
  fat: consulConfig.oss.fat
};