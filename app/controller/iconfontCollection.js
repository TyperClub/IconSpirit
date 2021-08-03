'use strict';

const Controller = require('egg').Controller;

class IconfontCollectionController extends Controller {
    async create(){
        const { ctx } = this;
        const body = ctx.request.body;
        const result = await ctx.service.iconfontCollection.create(body);
        ctx.helper.success({
            ctx,
            res: result
        })
    }
}

module.exports = IconfontCollectionController;
