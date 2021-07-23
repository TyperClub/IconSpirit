// service -> user.js
const Service = require('egg').Service
const FontCarrier = require('@icons/font-carrier')
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
            let item = data[index]
            let iconRes = await ctx.model.Iconfont.find({
                id: item.id
            })
            if(!iconRes.length){
                let iconId = await this.app.redis.incr("icon_id");
                d.push({
                    ...item,
                    unicode: iconId
                })
            }else{// 修改数据
                let ENG_Name = item.ENG_Name
                if(item.ENG_Name === "other"){
                    ENG_Name = iconRes[0].ENG_Name ? iconRes[0].ENG_Name: "other"
                }
                await ctx.model.Iconfont.updateOne({id: item.id}, {
                    ...item,
                    ENG_Name
                })
            }
        }
        if(d.length){
            res.data = await ctx.model.Iconfont.create(d);
            res.msg = '添加成功';
        }else{
            res.msg = '该数据重复，修改旧数据成功！';
        }
        res.code = 1;
        return res
    }

    async edit(data){
        const { ctx } = this;
        try {
            const user = await ctx.model.User.findOne({
                telephone: ctx.session.cas.user,
            });
            await ctx.model.Iconfont.updateOne({ 
                _id: data._id,
                authorEmail: user.userEmail
            },{
                CH_Name: data.CH_Name,
                ENG_Name: data.ENG_Name,
                content: data.content
            })
            return null
        } catch (e) {
            this.ctx.throw(500, e);
        }
    }

    async upload(data, files){
        const { ctx } = this;
        try {
            const user = await ctx.model.User.findOne({
                telephone: ctx.session.cas.user,
            });
            
            data = JSON.parse(data)
            for(let index in files){
                let item = files[index]
                let content = fs.readFileSync(item.filepath, "utf-8");
                let iconId = await this.app.redis.incr("icon_id");
                let itemData = {
                    id: `zmc-${iconId}`,
                    type: "zhangmen",
                    guropType: "1",
                    gurop : "自建",
                    author : user.userName,
                    authorEmail: user.userEmail,
                    CH_Name : data[item.filename.split(".svg")[0]].CH_Name,
                    ENG_Name : data[item.filename.split(".svg")[0]].ENG_Name,
                    content,
                    unicode : iconId
                }
                await ctx.model.Iconfont.create(itemData);
            }
            return null
        } catch (e) {
            this.ctx.throw(500, e);
        }
    }

    async myUpload(){
        try {
            const { ctx } = this;
            const user = await ctx.model.User.findOne({
                telephone: ctx.session.cas.user,
            });
            let result = await ctx.model.Iconfont.find({
                authorEmail: user.userEmail,
                isDeleted: false
            })
            return result
        } catch (e) {
            this.ctx.throw(500, e);
        }
    }

    async delete(data){
        try {
            const { ctx } = this;
            const user = await ctx.model.User.findOne({
                telephone: ctx.session.cas.user,
            });
            await ctx.model.Iconfont.updateOne({ _id: data.icon._id, authorEmail: user.userEmail }, {
                isDeleted: true,
                deleted_at: new Date()
            })
            return null
        } catch (e) {
            this.ctx.throw(500, e);
        }
    }

    async public(data){
        try {
            const { ctx } = this;
            const user = await ctx.model.User.findOne({
                telephone: ctx.session.cas.user,
            });
            await ctx.model.Iconfont.update({
                authorEmail: user.userEmail,
                guropType: "1"
            }, {
                $set: {
                    public: data.status
                }
                
            },{multi:true})
            return null
        } catch (e) {
            this.ctx.throw(500, e);
        }
    }

    async list(data){
        const { ctx } = this;
        const res = {...data};
        let query = {
            public: true,
            isDeleted: false
        }
        let sort = {_id: -1}
        if(data.name){
            query = {CH_Name: {$regex: `^${data.name}`, $options:'i'}, isDeleted: false}
            let query2 = {CH_Name: {$regex: `${data.name}`, $options:'i'}, isDeleted: false}
            sort = {CH_Name: 1}
            let countTyle = 1
            let l1 = ctx.model.Iconfont.find(query).skip(data.pageSize * (data.pageNum - 1)).limit(parseInt(data.pageSize)).sort(sort);
            let l2 = ctx.model.Iconfont.find(query2).skip(data.pageSize * (data.pageNum - 1)).limit(parseInt(data.pageSize)).sort(sort);
            let [list, list2] = await Promise.all([l1, l2])
            if(list.length < data.pageSize){
                let a = [],b = []
                list2.forEach(item => {
                    if(item.CH_Name === data.name){
                        a.push(item)
                    }else{
                        b.push(item)
                    }
                });
                list = [...a, ...b]
                countTyle = 2
            }

            res.data = list
            res.code = 1;
            res.msg = '查询成功';
            res.total = countTyle === 1 ? await ctx.model.Iconfont.find(query).count() : await ctx.model.Iconfont.find(query2).count()
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
            let l1 = await ctx.model.Iconfont.find(query).skip(data.pageSize * (data.pageNum - 1)).limit(parseInt(data.pageSize)).sort(sort);
            let l2 = await ctx.model.Iconfont.find(query).count()
            let [result, total] = await Promise.all([l1, l2])
            res.data = result
            res.code = 1;
            res.msg = '查询成功';
            res.total = total
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
        let filePath = `${configOss[this.app.env].path}/font_${res._id}_${projectNum}`

        let cssStyle = InitCssStyle(res.fontFamily, filePath, res.fontFormat, this.app.env)
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
            let putFile = [oss.put(`${filePath}.css`, new Buffer.from(cssStyle.join('')))]
            for(let index in res.fontFormat){
                let attr = res.fontFormat[index].toLowerCase()
                putFile.push(oss.put(`${filePath}.${attr}`, buffers[attr]))
            }
            const [result] = await Promise.all(putFile)

            if(result.res.statusCode == 200){
                await ctx.model.Project.updateOne({ _id: data.id }, {
                    font: {
                        cssFile: `${filePath}.css`,
                        unicodeStyle: cssStyle[0],
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
            
            let parameter = {
                "name": data.name,
                "description":"",
                "fontFormat":["WOFF2","WOFF","TTF"],
                "fontFamily": fontFamily,
                "prefix": prefix
            }
            
            let res = await ctx.model.Project.create({
                creater: user.userName,
                userEmail: user.userEmail,
                department: user.department,
                "font.type":  "迁移",
                "font.transferUrl": data.url,
                ...parameter
            });
            
            for(let index in iconListSvg){
                let item = iconListSvg[index]
                let content = Array.isArray(item.content) ? item.content.join("") : item.content
                await ctx.model.ProjectIcons.create({
                    id: `transfer-${item.unicode}`,
                    projectIconsId: res._id,
                    iconsId: `transfer-${item.unicode}`,
                    CH_Name: item.CH_Name,
                    ENG_Name: item.ENG_Name,
                    author: user.userName,
                    content,
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