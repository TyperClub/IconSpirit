// controller -> user.js
const Controller = require('egg').Controller
const JWT = require('jsonwebtoken');
class UserController extends Controller {
    //ldap 登录
    async login(){
        const { ctx } = this;
        const { username, password } = ctx.request.body;
        const res = await ctx.service.user.login({ username, password })

        const token = JWT.sign({
            telephone: res.telephoneNumber,
          }, this.config.jwt.secret);
        ctx.session.token = token
        ctx.session.cas = {
            user: res.telephoneNumber
        }

        ctx.helper.success({
            ctx,
            res: ctx.session
        })
    }

    async logout() {
        const { ctx } = this;
    
        ctx.session = null;
    
        ctx.helper.success({
          ctx,
          message: '退出成功!'
        })
    }

    async getUser(){
        const { ctx } = this;
        const user = ctx.session.cas && ctx.session.cas.user;

        const userRes = await ctx.service.user.findOne(user);
        
        // 1、如果数据库中存在该用户则不同步oa信息直接返回该用户相关信息，注意如果用户部门信息发生变更后需要手动数据库中改变不在同步
        if (userRes) {
            // 入库后用户信息userInfo放入 session
            ctx.helper.success({
                ctx,
                res: userRes
            })
            return false
        }

        // 2、如果数据库中不存在该用户则拉取OA信息同步
        console.log(2222, user, userRes)
    }
    async queryUser(){
        const { ctx } = this;
        const { u } = ctx.query;
        const res = await ctx.service.user.queryUserName(u);
        
        ctx.helper.success({
          ctx,
          res,
        });
    }
}

module.exports = UserController;