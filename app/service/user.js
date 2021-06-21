// service -> user.js
const Service = require('egg').Service
const JWT = require('jsonwebtoken');
const { authenticate } = require('ldap-authentication');
const AUTH_CONFIG = require('../config/ldap_config')

class UserSevice extends Service {
    /**
     * 查询所有的user
     */
    find() {
        // 还没有从数据库里查询
        const mockUsers = [
            { name: 'user1', age: 18, sex: 'girl', job: 'student' },
            { name: 'user2', age: 19, sex: 'girl', job: 'student' },
            { name: 'user3', age: 20, sex: 'boy', job: 'no job' },
        ]

        return Object.assign({}, {
            pageNum: 1,
            pageSize: 10,
            list: mockUsers
        })
    }

  async login({ username, password }){
    const { ctx } = this;
    const res = {};
    const options = AUTH_CONFIG[this.app.env]({ username, password })
    console.log(111, options)

    try {
      return await authenticate(options)
    } catch (e) {
      this.ctx.throw(500, e);
    }
  }

    // 登录接口
  async signin(signinMsg) {
    const { ctx } = this;
    const res = {};
    const queryResult = await ctx.model.User.findOne({
      userName: signinMsg.userName,
    });
    if (!queryResult) {
      res.code = -2;
      res.msg = '用户不存在,请前去注册';
      res.data = {};
    } else {
      const result = await ctx.model.User.findOne(signinMsg);
      if (!result) {
        res.code = -1;
        res.msg = '用户信息不正确';
        res.data = {};
      } else {
        const token = JWT.sign({
          userName: result.userName,
        },
        this.config.jwt.secret, {
          expiresIn: 60 * 60,
        });
        res.data = result;
        res.code = 1;
        res.msg = '登录成功';
        res.token = token;
      }
    }
    return res;
  }
  // 注册
  async signup(signupMsg) {
    const { ctx } = this;
    const res = {};
    // 查询用户名是否存在
    const queryResult = await ctx.model.User.findOne({
      userName: signupMsg.userName,
    });
    // 判断用户名是否存在
    if (queryResult) {
      res.code = -1;
      res.msg = '账号已存在';
    } else {
      // 创建用户
      res.data = await ctx.model.User.create(signupMsg);
      res.code = 1;
      res.msg = '注册成功';
    }
    return res;
  }
}

module.exports = UserSevice