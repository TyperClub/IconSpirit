'use strict';

const Controller = require('egg').Controller;

class IconfontController extends Controller {
  async generate() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async list(){
    const { ctx } = this;
    ctx.body = 'hi, egg';
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
