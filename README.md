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