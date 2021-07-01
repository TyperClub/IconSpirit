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
                
                await ctx.model.ProjectIcons.findOneAndUpdate(
                    {
                        iconsId: item._id,
                        isDeleted: false
                    }, 
                    { $set: {
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
                        } 
                    },
                    {upsert: true, new: true}
                )
            }
            return null
        }catch(e){
            this.ctx.throw(500, e);
        }
    }
}

module.exports = ProjectIconsSevice