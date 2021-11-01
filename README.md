# IconSpirit

<div align="center">
  <a href="https://iconspirit.vue2.net">
    <img src="https://f.vue2.net/IconSpiritd-03.jpg" alt="IconSpirit Logo" height="160">
  </a>
</div>

### 介绍

<a href="https://iconspirit.vue2.net">IconSpirit</a> 是基于 node + vue 开发的企业内网矢量图标库，吸收了市场上已有的阿里云 Iconfont、Icons8 等优秀的特点。为了契合公司局内网部署使用，增加了企业团队组织结构及权限功能，方便开发团队维护及使用。同时也适合设计师上传 svg 素材到公司内网 IconSpirit 上，打造企业内部的 Icons 公共平台。为了方便阿里云 iconfont 字体迁移到 IconSpirit 上，在项目管理页面上支持输入 css 链接地址，一键迁移操作。

### Icons 字体生成方案

![preview](https://web-data.zmlearn.com/image/cwyi1FF2iSbJtqXKrKiy1b/502280468-5cec90de12b0a_fix732.png)


1. 生成文件：支持生成的文件上传到阿里云 oss 平台，方便做 cdn 加速；
2. iconfont 迁移：支持从便阿里云 iconfont 字体迁移到 IconSpirit 上，通过 css 链接地址反解析生成 IconSpirit 新的项目；
3. 设计师的 Icons 平台：支持设计师上传 svg 素材到公司内网 IconSpirit 上，打造设计师的 Icons 内部公共平台；
4. 接口提供：支持其它平台调用 IconSpirit 接口。比如公司内部低代码平台需要使用到 icon 图标，可以直接接口调用查询 IconSpirit。

### 部署
1. 数据库配置：IconSpirit 需要配置 Redis，MongoDB 4.2+，阿里云 oss，Ldap 链接地址。默认是支持从 consul 获取配置数据信息。（见下文配置）
2. 部署后端：在虚机上使用 node 14+，运行 npm run egg:start 启动后端服务器；
3. 部署前端：npm run build 打包；在服务器上配置 nginx 映射到对应的 dist 目录上。

#### MongoDB 配置
打开 config/config.local.js 文件，找到 Redis 配置。MongoDB 请安装 4.2 及以上版本。
```javascript
exports.mongoose = {
    client: {
        url: 'mongodb://127.0.0.1:27017/ops-iconfont',
        options: {}
    }
}
```
#### Redis 配置
打开 config/config.local.js 文件，找到 Redis 配置。

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
#### 阿里云 oss 配置
生成的字体文件最终会上传到阿里云 oss 仓库，所以需要在 app/config/oss_config.js 中找到 OSS_local 或 OSS_fat 配置进行修改。

```javascript
const OSS_local =  {
  website: "", //阿里云 bucket 绑定的域名
  region: "",
  accessKeyId: "",
  accessKeySecret: "",
  bucket: "",
  cname: true,
  path: ""
}
```


##### Ldap 登录配置
在 app/config/ldap_config.js 文件内，填写对应的 Ldap 账号信息。
```javascript
const DEFAULT_CONFIG = {
  ldapOpts: {
    url: '',
  },
  adminDn: "",
  adminPassword: "",
  userSearchBase: "",
  usernameAttribute: "",
  username: '',
  userPassword: '',
}
```

### Todo List 计划
- [ ] 极速体验容器化部署 IconSpirit。（发布时间 11 月）
- [ ] 增加管理员页面，可在页面配置是否使用 Ldap、oss 等，同时可以管理团队、项目、成员。（发布时间 11 月）