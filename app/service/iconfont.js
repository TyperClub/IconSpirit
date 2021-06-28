// service -> user.js
const Service = require('egg').Service
const FontCarrier = require('font-carrier')

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

    async generate(data){
        const { ctx } = this;
        //判断是否有权限修改
        const res = await ctx.model.Project.findOne({ _id: data.id });
        const font = FontCarrier.create()
        console.log(1111, res.icons[0])
        font.setSvg('&#xe7bb;', res.icons[0].content)
        font.output({
            path: './test/iconfont'
        })
    }
}

module.exports = IconfontSevice