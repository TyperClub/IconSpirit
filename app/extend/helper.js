'use strict';
const Crypto = require('crypto');

module.exports = {
  encrypt(data) {
    // sha1加密
    const hmac = Crypto.createHmac('sha1', this.config.pwd_salt);
    hmac.update(data);
    const result = hmac.digest('hex');
    return result;
  },
  localDate(v) {
    const d = new Date(v || Date.now());
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString();
  },
  rndNum(n) {
    let rnd = '';
    for (let i = 0; i < n; i++) {
      rnd += Math.floor(Math.random() * 10);
    }
    return rnd;
  },
  success({
    ctx,
    res = null,
    message = '请求成功',
    page = null,
  }){
    ctx.body = {
      code: 200,
      data: res,
      paginate: page || null,
      message,
    };
  
    ctx.status = 200;
  },
};