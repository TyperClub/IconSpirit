'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.post('/api/v1/login', controller.user.login)
  router.post('/api/v1/logout', controller.user.logout)

  router.post('/api/v1/user', controller.user.getUser);
  router.post('/api/v1/user/query', controller.user.queryUser);

  router.post('/api/v1/project/create', controller.project.create);
  router.post('/api/v1/project/icons/create', controller.project.createProjectAndIcons);
  router.post('/api/v1/project/delete', controller.project.delete);
  router.get('/api/v1/project/list', controller.project.list);

  router.post('/api/v1/projectIcons/add', controller.projectIcons.add);
  router.post('/api/v1/projectIcons/delete', controller.projectIcons.delete);

  router.post('/api/v1/projectParticipants/add', controller.projectParticipants.add);
  router.post('/api/v1/projectParticipants/list', controller.projectParticipants.list);
  router.post('/api/v1/projectParticipants/delete', controller.projectParticipants.delete);

  router.get('/api/v1/iconfont/list', controller.iconfont.list)
  router.post('/api/v1/iconfont/generate', controller.iconfont.generate)
  router.post('/api/v1/iconfont/fontTransfer', controller.iconfont.fontTransfer)
  router.post('/api/v1/iconfont/add', controller.iconfont.add)
  router.get('/api/v1/iconfont/fontCss/download', controller.iconfont.downloadCssFile)
};
