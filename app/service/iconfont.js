// service -> user.js
const Service = require('egg').Service
const FontCarrier = require('font-carrier')
const Oss = require('../util/oss')
const fs = require('fs')
const path = require('path')
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

        let cssStyle = [`
@font-face {
    font-family: 'iconfont';
    src: url('iconfont.eot'); /* IE9 */
    src: url('iconfont.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
    url('iconfont.woff') format('woff2'),
    url('iconfont.woff') format('woff'), /* chrome、firefox */
    url('iconfont.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
    url('iconfont.svg#iconfont') format('svg'); /* iOS 4.1- */
}
.iconfont {
    font-family: "iconfont";
    font-size: 16px;
    font-style: normal;
}
`]
        for(let index in res.icons){
            let item = res.icons[index]
            let unicode = item.unicode
            let unicode16 = unicode.toString(16)
            
            cssStyle.push(`
.${res.prefix + item.ENG_Name}:before {
    content: "\\${unicode16}";
}
`)
            font.setSvg(`&#x${unicode16};`, item.content)
        }

        fs.writeFile(path.resolve(__dirname, '../../test/font.css'), cssStyle.join(''), { encoding: 'utf8' }, err => {})
        
        font.output({
            path: './test/iconfont'
        })

        // try {
        //     let result = await Oss.put('/test/font/font.css', new Buffer(cssStyle.join('')));
        //     console.log(result);
        // } catch (e) {
        //     console.log(e);
        // }

        // let buffers = font.output()
        // console.log(1111, buffers['svg'])
    }
}

module.exports = IconfontSevice