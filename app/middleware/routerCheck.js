'use strict';

module.exports = () => {
  return async function(ctx, next) {

    const user = ctx.session.cas && ctx.session.cas.user;
    const userInfo = ctx.session.userInfo || {};

    if (user) {
      ctx.userInfo = userInfo;
      await next();
    } else {
      ctx.helper.unauthorized({
        ctx,
      });
    }
  };
};
