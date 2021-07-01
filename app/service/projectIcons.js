const Service = require('egg').Service

class ProjectIconsSevice extends Service {
    async addIcons(data){
        const { ctx } = this;
        //判断是否有权限修改
        try{
            if(!data.icons.length) return null

            const res = await ctx.model.Project.findOne({ _id: data.id });

            for(let index in data.icons){
                let item = data.icons[index]

                let icon = await ctx.model.ProjectIcons.findOne({
                    iconsId: item._id,
                    isDeleted: false
                })

                if(!icon){
                    await ctx.model.ProjectIcons.create({
                        projectIconsId: res._id,
                        iconsId: item._id,
                        CH_Name: item.CH_Name,
                        ENG_Name: item.ENG_Name,
                        author: item.author,
                        content: item.content,
                        gurop: item.gurop,
                        type: item.type,
                        unicode: item.unicode,
                        createDate:  new Date(),
                        isDeleted: false
                    })

                    await ctx.model.Project.updateOne({ _id: data.id }, {
                        font: {
                            cssFile: res.font.cssFile,
                            fontIsOld: true
                        }
                    })
                }
            }
            return null
        }catch(e){
            this.ctx.throw(500, e);
        }
    }

    async deleteIcons(data){
        const { ctx } = this;
        try{
            await ctx.model.ProjectIcons.updateOne({ _id: data.icon._id },{
                isDeleted: true
            })
            await ctx.model.Project.updateOne({ _id: data.icon.projectIconsId }, {
                "font.fontIsOld": true
            })
            return null
        }catch(e){
            this.ctx.throw(500, e);
        }
    }
}

module.exports = ProjectIconsSevice