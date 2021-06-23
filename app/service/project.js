// service -> user.js
const Service = require('egg').Service

class ProjectSevice extends Service {
    async create(data){
        const { ctx } = this;
        console.log(ctx.userInfo)
        try{
            let res = await ctx.model.Project.create(data);
            return res
        }catch(e){
            this.ctx.throw(500, e);
        }
    }
}

module.exports = ProjectSevice