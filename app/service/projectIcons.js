const Service = require('egg').Service

class ProjectIconsSevice extends Service {
    async addIcons(data){
        const { ctx } = this;
        //判断是否有权限修改
        try{
            if(!data.icons.length) return null

            const res = await ctx.model.Project.findOne({ _id: data.id });
            const user = await ctx.model.User.findOne({
                telephone: ctx.session.cas.user,
            });

            for(let index in data.icons){
                let item = data.icons[index]

                let icon = await ctx.model.ProjectIcons.findOne({
                    iconsId: item._id,
                    projectIconsId: data.id
                })
                if(!icon){//不存在添加入库
                    let ENG_Name = item.ENG_Name === "" ? "other" : item.ENG_Name 
                    let icon2 = await ctx.model.ProjectIcons.findOne({
                        ENG_Name: ENG_Name,
                        projectIconsId: res._id
                    })
                    if(icon2){// class 重复
                        let unicode = item.unicode
                        let unicode16 = unicode.toString(16)
                        ENG_Name = ENG_Name + unicode16
                    }
                    await ctx.model.ProjectIcons.create({
                        id: item.id,
                        projectIconsId: res._id,
                        iconsId: item._id,
                        CH_Name: item.CH_Name,
                        ENG_Name: ENG_Name,
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
                            ...res.font,
                            fontIsOld: true
                        }
                    })
                    await ctx.model.History.create({
                        projectId:  data.id,
                        creater: user.userName,
                        createrEmail: user.userEmail,
                        operationType: "添加",
                        applicationType: "图标",
                        content: item.CH_Name
                    })
                }else{
                    if(icon.isDeleted === true){// 已删除后再添加，直接从删除中恢复？这种方式有问题
                        await ctx.model.ProjectIcons.updateOne({
                            iconsId: item._id
                        }, {
                            isDeleted: false
                        })

                        await ctx.model.Project.updateOne({ _id: data.id }, {
                            font: {
                                ...res.font,
                                fontIsOld: true
                            }
                        })
                        await ctx.model.History.create({
                            projectId:  data.id,
                            creater: user.userName,
                            createrEmail: user.userEmail,
                            operationType: "添加",
                            applicationType: "图标",
                            content: item.CH_Name
                        })
                    }
                }
            }
            return null
        }catch(e){
            this.ctx.throw(500, e);
        }
    }

    async editIcons(data){
        const { ctx } = this;
        try{
            await ctx.model.ProjectIcons.updateOne({ _id: data._id },{
                CH_Name: data.CH_Name,
                ENG_Name: data.ENG_Name,
                content: data.content
            })
            const user = await ctx.model.User.findOne({
                telephone: ctx.session.cas.user,
            });
            await ctx.model.History.create({
                projectId:  data._id,
                creater: user.userName,
                createrEmail: user.userEmail,
                operationType: "编辑",
                applicationType: "图标",
                content: data.CH_Name
            })
        }catch(e){
            this.ctx.throw(500, e);
        }
    }

    async deleteIcons(data){
        const { ctx } = this;
        try{
            await ctx.model.ProjectIcons.updateOne({ _id: data.icon._id },{
                isDeleted: true,
                deleted_at: new Date()
            })
            const user = await ctx.model.User.findOne({
                telephone: ctx.session.cas.user,
            });
            await ctx.model.History.create({
                projectId:  data.projectId,
                creater: user.userName,
                createrEmail: user.userEmail,
                operationType: "删除",
                applicationType: "图标",
                content: data.icon.CH_Name
            })
            return null
        }catch(e){
            this.ctx.throw(500, e);
        }
    }
}

module.exports = ProjectIconsSevice