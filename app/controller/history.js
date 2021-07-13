'use strict';

const Controller = require('egg').Controller;

class HistoryController extends Controller {
  async list() {
    const { ctx } = this;
    ctx.body = 'Initiated';
  }
}

module.exports = HistoryController;
