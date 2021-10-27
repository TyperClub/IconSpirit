#  Icon 技术方案

### 在线字体生成

通过 font-carrier 在线生成链接地址

![preview](https://web-data.zmlearn.com/image/cwyi1FF2iSbJtqXKrKiy1b/502280468-5cec90de12b0a_fix732.png)

生成输出

1. 生成 js 文件
2. 生成字体文件

### 在线组件生成

```
<iconpark-icon icon-id="15885"></iconpark-icon>
<iconpark-icon icon-id="15886"></iconpark-icon>
```

### 前端页面渲染 svg

1：根据接口返回渲染 html


#### 上传 svg 
1. 同步阿里云矢量图库
2. 支持上传阿里云 css 样式，反解析，同时生成 css 样式到 oss 仓库


### 部署
在虚机上 npm run egg:start 启动后端服务器，前端 npm run fat 打包，再部署在服务器就可以了。同时需要配置 redis，mognodb，oss，Ldap 链接地址。默认是支持从 consul 获取配置数据信息。

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

