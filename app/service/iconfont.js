// service -> user.js
const Service = require('egg').Service
const FontCarrier = require('font-carrier')

class IconfontSevice extends Service {
    async add(data) {
        const { ctx } = this;
        const res = {};
        
        let iconId = await this.app.redis.get("icon_id")
        if(!iconId){
            await this.app.redis.set("icon_id", 0)
        }

        let d = []
        for(let index in data){
            let iconRes = await ctx.model.Iconfont.find({
                id: data[index].id
            })
            if(!iconRes.length){
                let iconId = await this.app.redis.incr("icon_id");
                d.push({
                    ...data[index],
                    unicode: iconId
                })
            }
        }
        if(d.length){
            res.data = await ctx.model.Iconfont.create(d);
            res.msg = '添加成功';
        }else{
            res.msg = '重复添加';
        }
        res.code = 1;
        return res
    }

    async list(data){
        const { ctx } = this;
        const res = {...data};
        let query = {}
        if(data.name){
            query = {CH_Name: {$regex: data.name, $options:'i'}}
        }
        if(data.type == 1){
            res.data = await ctx.model.Iconfont.aggregate([
                { 
                    $group: { 
                        _id: {
                            gurop: "$gurop", 
                            author: "$author"
                        }, 
                        data: { 
                            $addToSet : {
                                CH_Name: "$CH_Name",
                                ENG_Name: "$ENG_Name",
                                content: "$content",
                                createTime: "$createTime"
                            }
                        } 
                    },
                },
                {$sort:{"createTime":1}},
                { $skip : data.pageSize * (data.pageNum - 1) },
                { $limit: parseInt(data.pageSize)}
            ])
        }else{
            res.data = await ctx.model.Iconfont.find(query).skip(data.pageSize * (data.pageNum - 1)).limit(parseInt(data.pageSize)).sort({ isSetTop: -1, sort: 1, editTime: -1 });
            res.code = 1;
            res.msg = '查询成功';
            res.total = await ctx.model.Iconfont.find(query).count()
        }
        return res
    }

    async generate(data){
        const { ctx } = this;
        //判断是否有权限修改
        const res = await ctx.model.Project.findOne({ _id: data.id });
        const font = FontCarrier.create()
        let iconsId = res.icons[0].id.replace(/[^0-9]/ig,"")
        console.log(1111, iconsId)
        font.setSvg('&#x1;', res.icons[0].content)
        font.output({
            path: './test/iconfont'
        })
    }
}

module.exports = IconfontSevice