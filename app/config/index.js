'use strict';

const hostConfig = require('./host_config');

function resolveEnv(key, env) {
  return hostConfig[key][env] ? hostConfig[key][env] : hostConfig[key].dev;
}

module.exports = {
  OA_HOST: env => resolveEnv('OA_HOST', env),
  OPS_HOST: env => resolveEnv('OPS_HOST', env)
};
