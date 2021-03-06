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
    const result = await ctx.service.iconfont.add(body);
    ctx.body = result;
  }

  async edit(){
    const { ctx } = this;
    const body = ctx.request.body
    const result = await ctx.service.iconfont.edit(body);
    ctx.helper.success({
        ctx,
        res: result
    })
  }

  async upload(){
    const { ctx } = this;
    const files = ctx.request.files
    const body = ctx.request.body
    const result = await ctx.service.iconfont.upload(body.data, files);
    ctx.helper.success({
        ctx,
        res: result
    })
  }

  async myUpload(){
    const { ctx } = this;
    const result = await ctx.service.iconfont.myUpload();
    ctx.helper.success({
        ctx,
        res: result
    })
  }

  async delete(){
    const { ctx } = this;
    const body = ctx.request.body;
    const result = await ctx.service.iconfont.delete(body);
    ctx.helper.success({
        ctx,
        res: result
    })
  }

  async public(){
    const { ctx } = this;
    const body = ctx.request.body;
    const result = await ctx.service.iconfont.public(body);
    ctx.helper.success({
        ctx,
        res: result
    })
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

  async collectionIcons(){
    const { ctx } = this;
    const body = ctx.query;
    const result = await ctx.service.iconfont.collectionIcons(body);
    ctx.helper.success({
        ctx,
        res: result
    })
  }
}

module.exports = IconfontController;
