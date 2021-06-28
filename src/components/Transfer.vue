<template>
     <div>
        <el-steps class="m-steps" :active="1" simple>
            <el-step title="迁移信息"></el-step>
            <el-step title="项目信息"></el-step>
        </el-steps>
        <div v-show="active == 1">
            <el-form  :model="form2" :rules="rules2" ref="form2"  label-width="115px">
                <el-form-item label="地址" prop="url">
                    <el-input style="width: 280px" v-model="form2.url" placeholder="请输入 iconfont css 链接地址" clearable></el-input>
                    <a class="u-link" href="https://www.iconfont.cn/" target="_blank">打开 iconfont 复制链接</a>
                </el-form-item>
            </el-form>
            <div v-for="(item, index) in iconList" class="p-icon-item" :key="index">
                <svg v-if="isSymbol" class="icon" aria-hidden="true" v-html="`<use xlink:href='${item.value}'></use>`"></svg>
                <p v-else class="opsfont" v-html="isCSS ? '' : item.show" :class="isCSS ? item.show : '' "></p>
                <p class="name">{{item.name}}</p>
                <p class="value">{{item.value}}</p>
            </div>
            <div class="btn-wrap first">
                <el-button type="primary" @click="next('form2')">下一步</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            bufferStr: null, // 字体编码内容
            isSymbol: false, // 是否 symbol 模式
            isCSS: false, // 是否 css 文件链接
            iconList: [], // icon 列表
            active: 1,
            form2: {
                url: ""
            },
            rules2: {
                url: [{ required: true, message: '请输入 iconfont css 链接地址', trigger: 'blur' }],
            }
        }
    },
    methods:{
        next(){
            console.log(this.form2.url)
            this.getURLFile()
        },
         // ajax 请求
        ajax(options) {
            options = options || {};
            let xhr = new XMLHttpRequest();
            if (options.type === 'buffer') {
                xhr.responseType = 'arraybuffer';
            }

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                let status = xhr.status;
                if (status >= 200 && status < 300) {
                    console.log(xhr)
                    options.success && options.success(xhr.response);
                } else {
                    options.fail && options.fail(status);
                }
                }
            };

            xhr.open("GET", options.url, true);
            xhr.send(null);
        },
        // 获取在线文件
        getURLFile() {
            if (this.form2.url.toLowerCase().indexOf('.ttf') !== -1) {
                this.getOnlineTTF()
            } else if (this.form2.url.toLowerCase().indexOf('.css') !== -1) {
                this.getOnlineCSS()
            } else if (this.form2.url.toLowerCase().indexOf('.js') !== -1) {
                this.getOnlineJS()
            }
        },
        getOnlineTTF() {
        // 远程获取文件
            this.ajax({
                url: this.form2.url,
                type: 'buffer',
                success: (params) => { this.parseIcon(params) }
            })

            this.setStyle(this.form2.url)
        },
          // 解析 CSS 文件
        getOnlineCSS() {
            // 远程获取文件
            this.isCSS = true;
            this.ajax({
                url: this.form2.url,
                success: (params) => {
                this.setStyle('', params)
                params.replace(/\.([^:^ ]+):[\s\S]+?content: "\\([^"]+)";/gi, (...item) => {
                    this.iconList.push({
                    show: item[1],
                    name: item[1],
                    value: `&#${item[2]};`,
                    })
                })
                }
            })
        },
        // 添加style
        setStyle(url, cssFile) {
            let $style = document.createElement('style')
            if (cssFile) {
                $style.innerHTML = cssFile
            } else {
                $style.innerHTML = `
                @font-face {
                    font-family: 'iconfont';
                    src: url('${url}') format('truetype');
                }
                .iconfont {
                    font-family: "iconfont" !important;
                    font-size: 24px;font-style: normal;
                    -webkit-font-smoothing: antialiased;
                    -webkit-text-stroke-width: 0.2px;
                    -moz-osx-font-smoothing: grayscale;
                }`;
            }
            document.body.append($style);
        },
           // 解析icon
        parseIcon(bufferStr, showAll) {
        this.bufferStr = bufferStr
        this.iconList = []
        let result = window.opentype.parse(this.bufferStr);
        for (let key in result.glyphs.glyphs) {
            let item = result.glyphs.glyphs[key]
            if (!item.unicode) {
            } else if (showAll) { // 是否显示所有 unicodes
            let valueStr = ''
            item.unicodes.forEach(unicode => valueStr += `&#${unicode};\n`)
            this.iconList.push({
                name: item.name,
                value: valueStr,
                show: `&#${item.unicode};`
            })
            } else {
            this.iconList.push({
                name: item.name,
                show: `&#${item.unicode};`,
                value: `&#${item.unicode};`
            })
            }
        }
        this.iconList.forEach(item => {
            item.value = item.value.replace(/&#([^;]+);/ig, (target, value) => {
            return `&#x${parseInt(value).toString(16)};`
            })
        })
        this.tips = '点击复制icon代码'
        },
    }
}
</script>

<style lang="less">
.m-transferBox .el-dialog__body{
    padding-top: 0px;
}
</style>

<style lang="less" scoped>


.m-steps{
    margin-bottom: 20px;
}
.btn-wrap {
  margin: 35px 0 -10px;
  display: flex;
  justify-content: space-between;
  &.first {
    text-align: right;
    display: block;
  }
}
.u-link{
    padding-left: 10px;
    text-decoration: none;
    font-size: 12px;
    color: #666;
    &:hover{
        color: #409EFF;
    }
}

/*icon 列表样式*/
  .p-icon-item {
    margin: 6px;
    padding: 10px 6px;
    display: inline-block;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid #dddddd;
    overflow: hidden;
    white-space: pre-line;
    box-sizing: border-box;
    transition-duration: .4s;
    transition-property: background, box-shadow;
  }
  .p-icon-item-background-0 {
    background-image: url(http://upyun.luckly-mjw.cn/Assets/base-source/png-background.png);
  }
  .p-icon-item-background-1 {
    background-color: #FCFCFC;
  }
  .p-icon-item-background-2 {
    background-color: #EBEBEB;
  }
  .p-icon-item:hover {
    background: #ffffff;
    border-color: transparent;
    box-shadow: 0 5px 18px 0 rgba(0, 0, 0, 0.3);
  }
  .p-icon-item:active {
    color: white;
    background: #7BD784;
  }
  .p-icon-item .iconfont {
    margin: 0 20px;
    padding: 6px;
    border-radius: 4px;
    font-size: 28px;
  }
  .p-icon-item .name {
    font-size: 12px;
    font-weight: bold;
  }
  .p-icon-item .value {
    font-size: 12px;
    font-weight: bold;
  }
  .p-icon-item svg {
    width: 36px;
    height: 36px;
  }
</style>