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

    async edit(){
        const { ctx } = this;
        const body = ctx.request.body;
        const result = await ctx.service.project.edit(body);
        ctx.helper.success({
            ctx,
            res: result
        })
    }

    async createProjectAndIcons(){
        const { ctx } = this;
        const body = ctx.request.body;
        const result = await ctx.service.project.createProjectAndIcons(body);
        ctx.helper.success({
            ctx,
            res: result
        })
    }

    async delete(){
        const { ctx } = this;
        const body = ctx.request.body;
        const result = await ctx.service.project.delete(body);
        ctx.helper.success({
            ctx,
            res: result
        })
    }

    async recovery(){
        const { ctx } = this;
        const body = ctx.request.body;
        const result = await ctx.service.project.recovery(body);
        ctx.helper.success({
            ctx,
            res: result
        })
    }

    async list(){
        const { ctx } = this;
        const result = await ctx.service.project.findAll();
        ctx.helper.success({
            ctx,
            res: result
        })
    }
}

module.exports = ProjectController;
