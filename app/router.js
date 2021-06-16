'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/api/v1/users', controller.user.getUserList)
  router.post('/api/v1/signin', controller.user.signin)
  router.post('/api/v1/signup', controller.user.signup)

  router.post('/api/v1/iconfont/generate', controller.iconfont.generate)
};
