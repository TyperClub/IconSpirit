'use strict';
const JWT = require('jsonwebtoken');

module.exports = options => {
  return async function(ctx, next) {
    const token = ctx.session.token;
    const method = ctx.method.toLowerCase();
    if (method === 'get') {
      await next();
    } else if (ctx.path === '/api/v1/signup' || 
      ctx.path === '/api/v1/signin' || 
      ctx.path === '/api/v1/login' || 
      ctx.path === '/api/v1/logou' || 
      ctx.path === '/api/v1/iconfont/generate' || 
      ctx.path === '/api/v1/iconfont/list'|| 
      ctx.path === '/api/v1/iconfont/add' ||
      ctx.path === '/@in/api/health'
    ) {
        await next();
    } else {
      let decode;
      try {
        if(!token){
          ctx.throw('401', '用户信息验证失败');
        }
        decode = JWT.verify(token, options.secret);
        if (!decode || !decode.telephone) {
          ctx.throw(401, '没有权限，请登录');
        }
        const user = await ctx.model.User.findOne({
          telephone: decode.telephone,
        });
        if (user) {
          await next();
        } else {
          ctx.throw('401', '用户信息验证失败');
        }
      } catch (e) {
        console.log(e);
        ctx.throw(500, e);
      }
    }
  };
}