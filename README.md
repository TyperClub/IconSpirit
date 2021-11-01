# IconSpirit

<div align="center">
  <a href="https://iconspirit.vue2.net">
    <img src="https://f.vue2.net/IconSpiritd-02.jpg" alt="IconSpirit Logo" height="300">
  </a>
</div>

### 介绍

<a href="https://iconspirit.vue2.net">IconSpirit</a> 是基于 node + vue 开发的企业内网矢量图标库，吸取了市场上已有的阿里云 Iconfont、Icons8 等优秀的特点。为了契合公司局内网使用，增加了公司组织结构及权限功能，方便开发团队维护及使用。同时也适合设计师上传 svg 素材到公司内网 IconSpirit 上，打造自己的 Icons 内部公共平台。为了方便阿里云 iconfont 字体迁移到 IconSpirit 上，在项目管理页面上支持输入 css 链接地址，一键迁移操作。

### 在线字体生成方案

![preview](https://web-data.zmlearn.com/image/cwyi1FF2iSbJtqXKrKiy1b/502280468-5cec90de12b0a_fix732.png)


1. 生成文件：支持生成的文件上传到阿里云 oss 平台，方便做 cdn 加速。
2. iconfont 迁移：支持从便阿里云 iconfont 字体迁移到 IconSpirit 上，通过 css 链接地址反解析生成 IconSpirit 新的项目。
3. 设计师平台：支持设计师上传 svg 素材到公司内网 IconSpirit 上，打造自己的 Icons 内部公共平台
4. 接口提供：支持公司内部其它接口调用。比如低代码平台接口调用查询 icons。

### 部署
1. 数据库配置：IconSpirit 需要配置 redis，mognodb 4+，阿里云 oss，Ldap 链接地址。默认是支持从 consul 获取配置数据信息。（见下文配置）；
2. 部署后端：在虚机上使用 node 14+，运行 npm run egg:start 启动后端服务器；
3. 部署前端：npm run build 打包；

#### mognodb 配置
打开 config/config.local.js 文件，找到 redis 配置。mognodb 请安装 4.2 及以上版本。
```javascript
exports.mongoose = {
    client: {
        url: 'mongodb://127.0.0.1:27017/ops-iconfont',
        options: {}
    }
}
```
#### redis 配置
打开 config/config.local.js 文件，找到 redis 配置

```javascript
exports.redis = {
    client: {
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      password: 'cc',
      db: 0
    }
}
```
#### oss 配置
生成的字体文件最终会上传到 oss 仓库，所以需要在 app/config/oss_config.js 中找到 OSS_local 或 OSS_local 配置进行修改。

```javascript
 OSS_local =  {
    website: "",
    region: "",
    accessKeyId: "",
    accessKeySecret: "",
    bucket: "",
    cname: true,
    path: ""
  }
```
##### Ldap 配置
在 app/config/ldap_config.js 文件内，填写对应的 Ldap 账号信息
```javascript
const DEFAULT_CONFIG = {
  ldapOpts: {
    url: '',
  },
  adminDn: consulConfig ? consulConfig.ldap.adminDn: "",
  adminPassword: consulConfig ? consulConfig.ldap.adminPassword: "",
  userSearchBase: consulConfig ? consulConfig.ldap.userSearchBase: "",
  usernameAttribute: consulConfig ? consulConfig.ldap.usernameAttribute : "",
  username: '',
  userPassword: '',
};
```
