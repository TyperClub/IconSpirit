// controller -> user.js
const Controller = require('egg').Controller
const JWT = require('jsonwebtoken');
class UserController extends Controller {
    /**
     * 获取用户列表
     */
    getUserList() {
        const { ctx, service } = this;
        // 假装这是从数据库读取的数据
        const users = service.user.find()
        ctx.body = {
            code: 0,
            message: 'success',
            data: users
        }
    }

      // 注册
    async signup() {
        const { ctx } = this;
        // 验证必填项
        const rule = {
        userName: { type: 'string', required: true, message: '必填项' },
        userPass: { type: 'string', required: true, message: '必填项' },
        userEmail: { type: 'email', required: true, message: '必填项' },
        };
        const signupMsg = ctx.request.body;
        // 验证必填项
        await ctx.validate(rule, signupMsg);
        // 密码加密
        signupMsg.userPass = ctx.helper.encrypt(signupMsg.userPass);
        // 保存用户
        const result = await ctx.service.user.signup(signupMsg);
        ctx.body = result;
    }

    // 登录接口
    async signin() {
        const { ctx, app } = this;
        const rule = {
            userName: { type: 'string', required: true, message: '必填项' },
            userPass: { type: 'string', required: true, message: '必填项' },
        };
        const signinMsg = ctx.request.body;
        await ctx.validate(rule, signinMsg);
        signinMsg.userPass = ctx.helper.encrypt(signinMsg.userPass);
        const result = await ctx.service.user.signin(signinMsg);
        ctx.body = result;
    }

    //ldap 登录
    async login(){
        const { ctx } = this;
        const { username, password } = ctx.request.body;
        const res = await ctx.service.user.login({ username, password })

        const token = JWT.sign({
            telephone: res.telephoneNumber,
          },
          this.config.jwt.secret, {
            expiresIn: 60 * 60,
        });
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
}

module.exports = UserController;