'use strict';

const Controller = require('egg').Controller;

class ProjectIconsController extends Controller {
    async addIcons(){
        const { ctx } = this;
        const body = ctx.request.body;
        const result = await ctx.service.projectIcons.addIcons(body);
        ctx.helper.success({
            ctx,
            res: result
        })
    }

    async edit(){
        const { ctx } = this;
        const body = ctx.request.body;
        const result = await ctx.service.projectIcons.editIcons(body);
        ctx.helper.success({
            ctx,
            res: result
        })
    }

    async delete(){
        const { ctx } = this;
        const body = ctx.request.body;
        const result = await ctx.service.projectIcons.deleteIcons(body);
        ctx.helper.success({
            ctx,
            res: result
        })
    }
}

module.exports = ProjectIconsController;
