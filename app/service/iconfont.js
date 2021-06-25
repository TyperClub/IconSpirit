// service -> user.js
const Service = require('egg').Service

class IconfontSevice extends Service {
    async add(data) {
        const { ctx } = this;
        const res = {};

        res.data = await ctx.model.Iconfont.create(data);
        res.code = 1;
        res.msg = '添加成功';
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
}

module.exports = IconfontSevice