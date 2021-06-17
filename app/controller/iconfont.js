'use strict';

const Controller = require('egg').Controller;

class IconfontController extends Controller {
  async generate() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
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
    // const rule = {
    //     id: { type: 'string', required: true, message: '必填项' },
    //     CH_Name: { type: 'string', required: true, message: '必填项' },
    // };
    const body = ctx.request.body;
    // await ctx.validate(rule, body.data);
    const result = await ctx.service.iconfont.add(body.data);
    ctx.body = result;
  }
}

module.exports = IconfontController;
