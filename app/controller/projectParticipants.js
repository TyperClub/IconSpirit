'use strict';

const Controller = require('egg').Controller;

class projectParticipantsController extends Controller {
    async add(){
        const { ctx } = this;
        const body = ctx.request.body;
        const result = await ctx.service.projectParticipants.addInvitation(body);
        ctx.helper.success({
            ctx,
            res: result
        })
    }

    async list(){
        const { ctx } = this;
        const body = ctx.request.body;
        const result = await ctx.service.projectParticipants.list(body);
        ctx.helper.success({
            ctx,
            res: result
        })
    }
}

module.exports = projectParticipantsController;
