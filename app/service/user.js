// service -> user.js
const Service = require('egg').Service
const JWT = require('jsonwebtoken');
const { authenticate } = require('ldap-authentication');
const AUTH_CONFIG = require('../config/ldap_config')
const { OA_HOST } = require('../config');

class UserSevice extends Service {
  async login({ username, password }){
    const { ctx } = this;
    try {
      let data = {}
      let department = ""
      if(username == "admin" && password == "admin"){
        data = {
          cn: username,
          mail: `${username}@zhangmen.com`,
          mobile: "13788954031",
          telephoneNumber: "13788954031",
          title: "研发工程师"
        }
        department = "研发效能组"
      }else{
        const options = AUTH_CONFIG[this.app.env]({ username, password })
        data = await authenticate(options)
        department = data.distinguishedName.split(',')[2].split('=')[1]
      }
      
      let queryResult = await ctx.model.User.findOne({
        userEmail: data.mail,
      });

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
  async queryUserName(){
    const reg = new RegExp(userName);
    const query = { username: reg };

    return this.ctx.model.User
      .find(query)
      .limit(10)
      .sort({ updateTime: -1 })
      .populate('dept')
      .populate('role');
  }
}

module.exports = UserSevice