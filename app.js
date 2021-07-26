
'use strict';

const { consulConfig } = require("./app/config/consul")

// app.js
class AppBootHook {
    constructor(app) {
      this.app = app;
    }
  
    async configWillLoad() {
        if(this.app.env === "fat"){
            const baseConfig = await consulConfig()
            console.log(111, baseConfig)
            // this.app.config.mongoose.client.url = baseConfig.mongoose.url
            // this.app.redis.client = baseConfig.redis
        }
    }
  }
  
  module.exports = AppBootHook;