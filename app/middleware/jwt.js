'use strict';
const JWT = require('jsonwebtoken');

module.exports = options => {
  return async function(ctx, next) {
    const token = ctx.session.token;
    const method = ctx.method.toLowerCase();
    if (method === 'get') {
      await next();
    } else if (!token) {
      if (ctx.path === '/api/v1/signup' || ctx.path === '/api/v1/signin' || ctx.path === '/api/v1/login' || ctx.path === '/api/v1/iconfont/generate' || ctx.path === '/api/v1/iconfont/list'
      || ctx.path === '/api/v1/iconfont/add') {
        await next();
      } else {
        ctx.throw(401, '未登录, 请先登录!!!');
      }
    } else {
      let decode;
      try {
        decode = JWT.verify(token, options.secret);
        console.log(111, decode);
        if (!decode || !decode.telephone) {
          ctx.throw(401, '没有权限，请登录');
        }
        if (Date.now() - decode.expire > 0) {
          ctx.throw(401, 'Token已过期');
        }
        const user = await ctx.model.User.find({
          telephone: decode.telephone,
        });
        if (user) {
          await next();
        } else {
          ctx.throw('401', '用户信息验证失败');
        }
      } catch (e) {
        console.log(e);
      }
    }
  };
}