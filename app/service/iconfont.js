// service -> user.js
const Service = require('egg').Service
const FontCarrier = require('@icons/font-carrier')
const Oss = require('../util/oss')
const configOss = require('../config/oss_config');
const RunTask = require('../task/main');
const {exec} = require('child_process')

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
        let type = data.type
        data = data.data
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
                if(type != 1){
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
                    iconColorType: "1",
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

        if(data.type == 1){
            res.data = await ctx.model.Iconfont.aggregate([
                {
                    $group: { 
                        _id: {
                            collectionId: "$collectionId"
                        }
                    },
                },
            ]).allowDiskUse(true)
            return res
        }else if(data.type == 2){
            let query = {}
            if(data.iconColorType) query.iconColorType = data.iconColorType
            if(data.iconColorType === "0,1") query.iconColorType = { $in: [ "0", "1" ] }
            if(data.name){
                query.gurop = {$regex: `${data.name}`, $options:'i'}
            }
           
            let [iconfontCollection, iconfontCollectionCount] = await Promise.all([
                ctx.model.IconfontCollection.find(query).skip(data.pageSize * (data.pageNum - 1)).limit(parseInt(data.pageSize)),
                ctx.model.IconfontCollection.countDocuments(query)
            ])
            let request = []
            for (let index in iconfontCollection) {
                request.push(ctx.model.Iconfont.find({
                    collectionId: iconfontCollection[index].collectionId}, {
                        _id: 0,
                        id: 0, 
                        author: 0, 
                        gurop: 0, 
                        unicode: 0, 
                        unicodeAlibaba: 0,
                        createTime: 0,
                        isDeleted: 0,
                        public: 0,
                        tag_ids: 0,
                        description: 0,
                        iconColorType: 0
                    }
                ).limit(15))
            }

            for (let index in iconfontCollection) {
                request.push(
                    ctx.model.Iconfont.countDocuments({
                        collectionId: iconfontCollection[index].collectionId
                    })
                )
            }
            let icons = await Promise.all(request)
            let collection = []
            let i = 0
            let len = iconfontCollection.length > 9 ? 9 : iconfontCollection.length
            for(let index in icons){
                if(index >= len){
                    let item = iconfontCollection[i]
                    collection.push({
                        ...item._doc,
                        icons: icons[i],
                        count: icons[index]
                    })
                    i++
                }
            }
            res.count = iconfontCollectionCount
            res.data = collection
            return res
        }else{
            let query = {
                public: true,
                isDeleted: false
            }
            if(data.iconColorType) query.iconColorType = data.iconColorType
            if(data.iconColorType === "0,1") query.iconColorType = { $in: [ "0", "1" ] }
            let sort = {_id: -1}
            if(data.name){
                let query1 = {
                    ...query,
                    CH_Name: {$regex: `^${data.name}`, $options:'i'}, 
                }
                let query2 = {
                    ...query,
                    CH_Name: {$regex: `${data.name}`, $options:'i'},
                }
                sort = {CH_Name: 1}
                let countTyle = 1
                let l1 = ctx.model.Iconfont.find(query1).skip(data.pageSize * (data.pageNum - 1)).limit(parseInt(data.pageSize)).sort(sort);
                let l2 = ctx.model.Iconfont.find(query2).skip(data.pageSize * (data.pageNum - 1)).limit(parseInt(data.pageSize)).sort(sort);
                let p1 = ctx.model.Iconfont.countDocuments(query1)
                let p2 = ctx.model.Iconfont.countDocuments(query2)
                let [list, list2, total1, total2] = await Promise.all([l1, l2, p1, p2])
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
                let total = countTyle === 1 ? total1 : total2
                // exec(`node ${path.resolve(__dirname, '../task/main.js')} ${this.app.env} ${data.name}`)
                // new RunTask().queryName(1, data.name, this.app.env)
                res.data = list
                res.code = 1;
                res.msg = '查询成功';
                res.total = total
                return res
            }

            let l1 = ctx.model.Iconfont.find(query).skip(data.pageSize * (data.pageNum - 1)).limit(parseInt(data.pageSize)).sort(sort);
            let l2 =  data.iconColorType ||  query.type ? ctx.model.Iconfont.countDocuments(query) : ctx.model.Iconfont.estimatedDocumentCount()
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
            font.setSvg(`&#x${unicode16};`, item.content) // 设置 svg
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

    async collectionIcons(data){
        const { ctx } = this;
        try{
            let res = await ctx.model.Iconfont.find({
                collectionId: data.id
            })
            return res
        }catch(e){
            this.ctx.throw(500, e);
        }
    }
}

module.exports = IconfontSevice