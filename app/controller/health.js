'use strict';

const Controller = require('egg').Controller;

class HealthController extends Controller {
  async health() {
    const { ctx } = this;
    ctx.body = 'Initiated';
  }
}

module.exports = HealthController;
