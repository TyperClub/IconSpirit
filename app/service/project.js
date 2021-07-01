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
                department: user.department,
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
            let res = await ctx.model.Project.find({
                isDeleted: false
            });
            for(let index in res){
                let item = res[index]
                let icons = await ctx.model.ProjectIcons.find({
                    projectIconsId: item._id
                }).sort({createDate: -1})
                item.icons = icons
            }
            
            return res
        }catch(e){
            this.ctx.throw(500, e);
        }
    }
}

module.exports = ProjectSevice