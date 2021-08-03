const Service = require('egg').Service

class IconfontCollectionSevice extends Service {
    async create(data){
        const { ctx } = this;
        try{
            data = data.data
            for (let attr in data) {
                let collectionId = data[attr]._id.collectionId
                if(collectionId){
                    let res = await ctx.model.Iconfont.findOne({
                        collectionId
                    })
                    
                    await ctx.model.IconfontCollection.update({collectionId},{
                        collectionId,
                        description: res.description,
                        type: res.type,
                        iconColorType: res.iconColorType,
                        guropType: 2,
                        gurop: res.gurop,
                        author: res.author,
                        createTime: new Date()
                    }, {upsert:true})
                }
            }
            return null
        }catch(e){
            this.ctx.throw(500, e);
        }
    }
}

module.exports = IconfontCollectionSevice