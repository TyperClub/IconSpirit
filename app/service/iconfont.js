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
}

module.exports = IconfontSevice