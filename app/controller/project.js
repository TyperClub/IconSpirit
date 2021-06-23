'use strict';

const Controller = require('egg').Controller;

class ProjectController extends Controller {
    async create(){
        const { ctx } = this;
        const body = ctx.request.body;
        const result = await ctx.service.project.create(body);
        ctx.helper.success({
            ctx,
            res: result
        })
    }
}

module.exports = ProjectController;
