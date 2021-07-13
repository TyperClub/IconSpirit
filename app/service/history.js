const Service = require('egg').Service

class historySevice extends Service {
    async list(data){
        const { ctx } = this;
        try{
            let res = await ctx.model.History.find({
                projectId: data.id
            }).sort({updated_at: -1})
            return res
        }catch(e){
            this.ctx.throw(500, e);
        }
    }
}

module.exports = historySevice