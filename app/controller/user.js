// controller -> user.js
const Controller = require('egg').Controller

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
}

module.exports = UserController;