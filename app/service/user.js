// service -> user.js
const Service = require('egg').Service
const JWT = require('jsonwebtoken');
const { authenticate } = require('ldap-authentication');
const AUTH_CONFIG = require('../config/ldap_config')
const { OA_HOST } = require('../config');

class UserSevice extends Service {
  async login({ username, password }){
    const { ctx } = this;
    const options = AUTH_CONFIG[this.app.env]({ username, password })

    try {
      let data = await authenticate(options)
      let queryResult = await ctx.model.User.findOne({
        userEmail: data.mail,
      });

      let department = data.distinguishedName.split(',')[2].split('=')[1]
      if (!queryResult) {
        //创建用户
        await ctx.model.User.create({
          userName: data.cn,
          userEmail: data.mail,
          telephone: data.mobile,
          occupation: data.title,
          department: department
        });
      }else{
        await ctx.model.User.update({
          userEmail: data.mail,
        },{
          userName: data.cn,
          telephone: data.mobile,
          occupation: data.title,
          department: department
        });
      }
      
      return data
    } catch (e) {
      this.ctx.throw(500, e);
    }
  }

  async getUserInfoByMobile({ mobile }) {
    const ctx = this.ctx;
    let userData;
    // curl http://open-ng.zmlearn.com/api/oa/personManage/getBasePersonInfo -X POST -d '{"mobile": "13651813361"}' --header "Content-Type: application/json"
    try {
      userData = await ctx.curl(`${OA_HOST(this.app.env)}/api/oa/personManage/getBasePersonInfo`, {
        method: 'POST',
        contentType: 'json',
        dataType: 'json',
        data: {
          mobile,
        },
      });
    } catch (e) {
      this.ctx.throw(500, e);
    }
    return userData.data && userData.data.data;
  }
  async findOne(mobile) {
    return this.ctx.model.User
      .findOne({ telephone: mobile })
      .populate('dept')
      .populate('role');
  }
}

module.exports = UserSevice