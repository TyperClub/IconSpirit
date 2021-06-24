// service -> user.js
const Service = require('egg').Service

class ProjectSevice extends Service {
    async create(data){
        const { ctx } = this;
        try{
            const user = await ctx.model.User.findOne({
                telephone: ctx.session.cas.user,
            });
            let res = await ctx.model.Project.create({
                creater: user.userName,
                userEmail: user.userEmail,
                ...data
            });
            return res
        }catch(e){
            this.ctx.throw(500, e);
        }
    }
    async findAll(){
        const { ctx } = this;
        try{
            let res = await ctx.model.Project.find();
            return res
        }catch(e){
            this.ctx.throw(500, e);
        }
    }
    async addIcons(data){
        const { ctx } = this;
        //判断是否有权限修改
        try{
            let res = await ctx.model.Project.updateOne({ _id: data.id }, {
                icons: data.icons
            })
            return null
        }catch(e){
            this.ctx.throw(500, e);
        }
    }
}

module.exports = ProjectSevice