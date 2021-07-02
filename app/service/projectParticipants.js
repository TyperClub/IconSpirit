const Service = require('egg').Service

class projectParticipantsSevice extends Service {
    async addInvitation(data){
        const { ctx } = this;
        try{
            const user = await ctx.model.User.findOne({
                _id: data.id,
            });

            const projectParticipants = await ctx.model.ProjectParticipants.findOne({
                projectId: data.projectId,
                userEmail: user.userEmail
            });
            
            if(!projectParticipants){
                await ctx.model.ProjectParticipants.create({
                    projectId: data.projectId,
                    userName: user.userName,
                    userEmail: user.userEmail,
                    department: user.department,
                    occupation: user.occupation
                });
            }
            return null
        }catch(e){
            this.ctx.throw(500, e);
        }
    }

    async list(data){
        const { ctx } = this;
        try{
            const projectParticipants = await ctx.model.ProjectParticipants.find({
                projectId: data.projectId,
            });
            return projectParticipants
        }catch(e){
            this.ctx.throw(500, e);
        }
    }
}

module.exports = projectParticipantsSevice