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
}

module.exports = IconfontController;
