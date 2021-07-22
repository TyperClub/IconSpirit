'use strict';

const Controller = require('egg').Controller;

class IconfontController extends Controller {
  async generate() {
    const { ctx } = this;
    const body = ctx.request.body;
    const result = await ctx.service.iconfont.generate(body);
    ctx.helper.success({
        ctx,
        res: result
    })
  }

  async fontTransfer(){
    const { ctx } = this;
    const body = ctx.request.body;
    const result = await ctx.service.iconfont.fontTransfer(body);
    ctx.helper.success({
        ctx,
        res: result
    })
  }

  async list(){
    const { ctx } = this;
    const rule = {
        pageNum: { type: 'string', required: true, message: '必填项' },
        pageSize: { type: 'string', required: true, message: '必填项' },
    };
    const body = ctx.query;
    await ctx.validate(rule, body);
    const result = await ctx.service.iconfont.list(body);
    ctx.body = result
  }

  async add(){
    const { ctx } = this;
    const body = ctx.request.body;
    const result = await ctx.service.iconfont.add(body.data);
    ctx.body = result;
  }

  async upload(){
    const { ctx } = this;
    const files = ctx.request.files
    const body = ctx.request.body
    console.log(JSON.parse(body.data), files)
    ctx.body = {};
  }

  async downloadCssFile(){
    const { ctx } = this;
    const body = ctx.query;
    const result = await ctx.service.iconfont.downloadCssFile(body);
    ctx.helper.success({
        ctx,
        res: result
    })
  }
}

module.exports = IconfontController;
