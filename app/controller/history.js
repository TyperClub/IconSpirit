'use strict';

const Controller = require('egg').Controller;

class HistoryController extends Controller {
  async list() {
        const { ctx } = this;
        const body = ctx.query;
        const result = await ctx.service.history.list(body);
        ctx.helper.success({
            ctx,
            res: result
        })
  }
}

module.exports = HistoryController;
