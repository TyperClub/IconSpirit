// service -> user.js
const Service = require('egg').Service
const FontCarrier = require('font-carrier')
const Oss = require('../util/oss')
const configOss = require('../config/oss_config');
const { InitCssStyle, addItemStyle, transfer } = require('../util/cssStyle')
const fs = require('fs')
const path = require('path')
const request = require('request')
const rp  = require('request-promise');

class IconfontSevice extends Service {
    async downloadCssFile(data){
        const { ctx } = this;
        try{
            const res = await ctx.model.Project.findOne({ _id: data.id });
            let url = `https:${res.font.website}${res.font.cssFile}`
            let response = await rp({
                uri: url,
                method:'GET',
                encoding: "binary",
            });
            return {
                content: response
            }
        }catch(e){
            this.ctx.throw(500, e);
        }
    }
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
        let sort = {_id: -1}
        if(data.name){
            query = {CH_Name: {$regex: `^${data.name}`, $options:'i'}}
            sort = {CH_Name: 1}
            let list = []
            list = await ctx.model.Iconfont.find(query).skip(data.pageSize * (data.pageNum - 1)).limit(parseInt(data.pageSize)).sort(sort);
            if(list.length < data.pageSize){
                list = await ctx.model.Iconfont.find( {CH_Name: {$regex: `${data.name}`, $options:'i'}}).skip(data.pageSize * (data.pageNum - 1)).limit(parseInt(data.pageSize)).sort(sort);
            }

            res.data = list
            res.code = 1;
            res.msg = '查询成功';
            res.total = await ctx.model.Iconfont.find(query).count()
            return res
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
                {$sort:{"_id": -1}},
                { $skip : data.pageSize * (data.pageNum - 1) },
                { $limit: parseInt(data.pageSize)}
            ])
        }else{
            res.data = await ctx.model.Iconfont.find(query).skip(data.pageSize * (data.pageNum - 1)).limit(parseInt(data.pageSize)).sort(sort);
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
        const icons = await ctx.model.ProjectIcons.find({ projectIconsId: data.id, isDeleted: false});

        if(icons.length === 0 || !res.font.fontIsOld){
            return null
        }
        
        const font = FontCarrier.create()

        let projectNum = await this.app.redis.get(`icons_project_${res._id}`)
        if(!projectNum){
            await this.app.redis.set(`icons_project_${res._id}`, 0)
        }
        projectNum = await this.app.redis.incr(`icons_project_${res._id}`);
        let path = `${configOss[this.app.env].path}/font_${res._id}_${projectNum}`

        let cssStyle = InitCssStyle(res.fontFamily, path, res.fontFormat, this.app.env)
        for(let index in icons){
            let item = icons[index]
            let unicode = item.unicode
            let unicode16 = unicode.toString(16)
            let className = res.prefix + item.ENG_Name
            cssStyle.push(addItemStyle(className, unicode16))
            font.setSvg(`&#x${unicode16};`, item.content)
        }

        // fs.writeFile(path.resolve(__dirname, '../../test/font.css'), cssStyle.join(''), { encoding: 'utf8' }, err => {})
        
        // font.output({
        //     path: './test/iconfont'
        // })

        try {
            const oss = Oss(this.app.env)
            let buffers = font.output()
            let putFile = [oss.put(`${path}.css`, new Buffer.from(cssStyle.join('')))]
            for(let index in res.fontFormat){
                let attr = res.fontFormat[index].toLowerCase()
                putFile.push(oss.put(`${path}.${attr}`, buffers[attr]))
            }
            const [result] = await Promise.all(putFile)

            if(result.res.statusCode == 200){
                await ctx.model.Project.updateOne({ _id: data.id }, {
                    font: {
                        cssFile: `${path}.css`,
                        fontIsOld: false
                    }
                })
            }
            return null
        } catch (e) {
            this.ctx.throw(500, e);
        }
    }

    async fontTransfer(data){
        const { ctx } = this;
        try{
            
            let { fontFamily, prefix, iconListSvg} = await transfer(data.url)

            const user = await ctx.model.User.findOne({
                telephone: ctx.session.cas.user,
            });
            let parameter = {"name": data.name,"description":"","fontFormat":["WOFF2","WOFF","TTF"],"fontFamily": fontFamily,"prefix": prefix}
            
            let res = await ctx.model.Project.create({
                creater: user.userName,
                userEmail: user.userEmail,
                department: user.department,
                ...parameter
            });
            
            for(let index in iconListSvg){
                let item = iconListSvg[index]
                await ctx.model.ProjectIcons.create({
                    id: `transfer-${item.unicode}`,
                    projectIconsId: res._id,
                    iconsId: `transfer-${item.unicode}`,
                    CH_Name: item.CH_Name,
                    ENG_Name: item.ENG_Name,
                    author: user.userName,
                    content: item.content,
                    gurop: user.department,
                    type: "transfer",
                    unicode: item.unicode,
                    createDate:  new Date(),
                    isDeleted: false
                })
            }
            return res
        }catch(e){
            this.ctx.throw(500, e);
        }        
    }
}

module.exports = IconfontSevice