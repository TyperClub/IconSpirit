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
    async createProjectAndIcons(data){
        const { ctx } = this;
        try{
            const user = await ctx.model.User.findOne({
                telephone: ctx.session.cas.user,
            });
            let res = await ctx.model.Project.create({
                creater: user.userName,
                userEmail: user.userEmail,
                department: user.department,
                name: data.projectName
            });
            await ctx.service.projectIcons.addIcons({
                id: res._id,
                icons: data.icons
            })
            return res
        }catch(e){
            this.ctx.throw(500, e);
        }
    }
    async delete(data){
        const { ctx } = this;
        try{
            const user = await ctx.model.User.findOne({
                telephone: ctx.session.cas.user,
            });
            let res = await ctx.model.Project.updateOne({_id: data.id}, {
                deletedPerson: user.userName,
                isDeleted: true,
                deleted_at: new Date()
            });
            return res
        }catch(e){
            this.ctx.throw(500, e);
        }
    }
    async findAll(){
        const { ctx } = this;
        try{
            const user = await ctx.model.User.findOne({
                telephone: ctx.session.cas.user,
            });
            // 查询发起项目
            let ownProjects = await ctx.model.Project.find({
                isDeleted: false,
                userEmail: user.userEmail
            });
            for(let index in ownProjects){
                let item = ownProjects[index]
                let icons = await ctx.model.ProjectIcons.find({
                    projectIconsId: item._id,
                    isDeleted: false
                }).sort({createDate: -1})
                item.icons = icons
            }

            const participantsProjects = await ctx.model.ProjectParticipants.find({
                userEmail: user.userEmail,
            });

            // 查询删除项目
            let delProjects = await ctx.model.Project.find({
                isDeleted: true,
                userEmail: user.userEmail //被自己删除，或者被其它参入者给删除
            });
            
            //查询被邀请项目
            let corpProjects = []

            for(let index in participantsProjects){
                let item = participantsProjects[index]
                let project = await ctx.model.Project.findOne({
                    isDeleted: false,
                    _id: item.projectId
                })
                if(project){
                    project.icons = await ctx.model.ProjectIcons.find({
                        projectIconsId: item.projectId,
                        isDeleted: false
                    }).sort({createDate: -1})
                    
                    corpProjects.push(project)
                }
            }

            return {
                ownProjects,
                delProjects,
                corpProjects
            }
        }catch(e){
            this.ctx.throw(500, e);
        }
    }
}

module.exports = ProjectSevice