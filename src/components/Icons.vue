<template>
    <div>
        <el-row class="m-icons">
            <el-col :span="3" class="u-item" v-for="(item, index) in projectList && projectList.icons" :key="index">
                <div class="icon-base-view" :class="item.status ? 'icon-base-selected' : '' ">
                    <div class="u-icon-svg" v-html="item.content"></div>
                    <p class="icon-name">{{item.CH_Name}}</p>
                    <p class="icon-code" v-if="tabPosition === '1'">{{`&\#x${item.unicode.toString(16)};`}}</p>
                    <p class="icon-code" v-else>{{projectList.prefix + item.ENG_Name}}</p>
                    <div class="icon-cover">
                        <i title="添加入库" @click="addToCart($event, item)" :class="item.status ? 'ops-03f': 'ops-03'"  class="opsfont cover-item"></i>
                        <i title="编辑" @click="editIcon(item)" class="el-icon-edit cover-item"></i>
                        <i title="删除" @click="deleteIcon(item)" class="el-icon-delete cover-item"></i>
                        <i title="下载" @click="downIcon(item)" class="opsfont ops-xiazai cover-item"></i>
                        <div class="cover-code cover-copy copy-code2" :aria-label="tabPosition === '1' ? `&\#x${item.unicode.toString(16)};` :  projectList.prefix + item.ENG_Name " @click="copyCode2">
                            <span><i class="opsfont ops-fuzhi"></i> 复制代码</span>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-dialog
        title="编辑详情"
        v-model="dialogVisible"
        width="980px"
        :before-close="handleClose">
        <div class="m-editIcon">
            <el-row>
                <el-col :span="12">
                    <div class="icon-container">
                        <div class="icon-container-tool">
                                <span @click="revokeIcon"><i class="opsfont ops-chexiao"></i> 撤销</span>
                                <span @click="zoomIcon('zoom')"><i class="opsfont ops-fangda"></i> 放大</span>
                                <span @click="zoomIcon('slack')"><i class="opsfont ops-suoxiao1"></i> 缩小</span>
                        </div>
                        <div class="icon-container-svg" :key="svgCodeIndex" v-html="svgCode"></div>
                    </div>
                </el-col>
                <el-col :span="12">
                        <el-form class="m-form" ref="form" :model="form" :rules="rules" label-width="140px">
                            <el-form-item label="图标中文名称" prop="CH_Name">
                                <el-input class="u-input-text" size="small" v-model="form.CH_Name" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="图标英文名称" prop="ENG_Name">
                                <el-input class="u-input-text" size="small" v-model="form.ENG_Name" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="图标分组">
                                <el-input disabled class="u-input-text" size="small" v-model="form.gurop"></el-input>
                            </el-form-item>
                            <el-form-item label="图标颜色">
                                <el-input style="width: 200px" class="u-input-text" placeholder="请输入内容" size="small"  v-model="color"></el-input>
                                <el-color-picker @change="changeColorPicker" class="u-colorPicker" size="small" v-model="color"></el-color-picker>
                            </el-form-item>
                            <el-form-item label="旋转">
                                <i class="opsfont ops-rotatexuanzhuan2 u-rotatexuanzhuan" @click="rotateIcon('left')"></i>
                                <i class="opsfont ops-rotatexuanzhuan u-rotatexuanzhuan" @click="rotateIcon('right')"></i>
                            </el-form-item>
                        </el-form>
                </el-col>
            </el-row>
            <div class="m-edit-button">
                    <el-button size="small" @click="dialogVisible = false">取消</el-button>
                    <el-button size="small" @click="next('form')" type="primary">保存并关闭</el-button>
            </div>
        </div>
        </el-dialog>
         <!-- 小球 -->
        <transition appear
            @before-appear="beforeEnter"
            @enter="enter"
            @after-appear='afterEnter'
            v-for="(item,index) in showMoveDot"
            :key="index.id">
                <div class="move_dot"
                    ref="ball"
                    v-if="item" :style="{top:elTop+'px',left:elLeft+'px'}" v-html="imgUrl">
                </div>
        </transition>
    </div>
</template>

<script>
import { SVG } from '@svgdotjs/svg.js'
import '@svgdotjs/svg.draggable.js'
import Clipboard from 'clipboard'
import $ from 'jquery'
import { 
    deleteProjectIcons,
    editProjectIcons,
    deleteIcons,
    editIcons
} from '../services/index';

export default {
    props: {
        projectList: Object,
        tabPosition: {
            type: String,
            default: "2"
        },
        type: {
            type: String,
            default: "myProjects"
        }
    },
    data(){
        return {
            dialogVisible: false,
            svgCodeIndex: 0, //撤销次数
            svgCode: "",
            color: "",
            showMoveDot: [],
            imgUrl:'',
            elLeft: 0, //当前点击购物车按钮在网页中的绝对top值
            elTop: 0, //当前点击购物车按钮在网页中的绝对left值
            form: {
                CH_Name: "",
                ENG_Name: ""
            },
            rules: {
                CH_Name:  [{ required: true, message: '请输入图标中文名称', trigger: 'blur' }],
                ENG_Name:  [{ required: true, message: '请输入英文名称', trigger: 'blur' }],
            }
        }
    },
    methods: {
        deleteIcon(item){
            this.$confirm('确定要删除图标吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(this.type === "myProjects"){
                    deleteProjectIcons({
                        projectId: this.projectList._id,
                        icon: item
                    }).then(res=>{
                        if(res.code === 200){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.$emit('newGetProjects')
                        }
                    })
                }else{
                    deleteIcons({
                        icon: item
                    }).then(res=>{
                        if(res.code === 200){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.$emit('newGetProjects')
                        }
                    })
                }
                
            })
        },
        downIcon(item){
            let dataURL = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(item.content))); //给图片对象写入base64编码的svg流
            let dl = document.createElement("a");
            let fileName = this.projectList.prefix + item.ENG_Name
            dl.style.display = 'none';
            document.body.appendChild(dl); // This line makes it work in Firefox.
            dl.setAttribute("href", dataURL);
            dl.setAttribute("download", `${fileName}.svg`);
            dl.click();
            // 然后移除
            document.body.removeChild(dl);
        },
        copyCode2(){
            let clipboard = new Clipboard('.copy-code2', {
                text: function(trigger) {
                    return trigger.getAttribute('aria-label');
                }
            });

            clipboard.on('success', (e) => {
                this.$message.success("复制成功！")
                // 释放内存
                e.clearSelection();
                clipboard.destroy()
            })
            clipboard.on('error', (e) => {
                // 不支持复制
                console.log('该浏览器不支持自动复制', e)
                // 释放内存
                e.clearSelection();
                clipboard.destroy()
            })
        },
        editIcon(item){
            this.svgCode = item.content
            this.dialogVisible = true
            this.svgCodeIndex = ++ this.svgCodeIndex
            this.color = ""
            this.form = {
                ...item
            }
            this.operationElementSvg()
        },
        operationElementSvg(){
            this.$nextTick(()=>{
                let draw = SVG(".icon-container-svg svg")
                let list = draw.find('path')
                
                list.forEach(obj => {

                    obj = obj.draggable()
                    var s = null;
                    obj.on("dragstart", function() {
                        s = obj.clone().opacity(0.2);
                    });

                    obj.on("dragmove", function() {
                        console.log('dragmove')
                        s.animate(200, '>').move(obj.x(), obj.y());
                    });

                    obj.on("dragend", function() {
                        console.log('dragend')
                        s.remove();
                    });
                });
                
                $(".icon-container-svg").click((el)=> {
                    if(el.target.nodeName === "path"){
                         $(el.target).addClass('selected').siblings().removeClass("selected")
                    }else{
                        $(".icon-container-svg path").removeClass("selected")
                    }
                })
            })
        },
         zoomIcon(type){
            let selectedPath = SVG(".icon-container-svg .selected")
            if(selectedPath){
                if(type === "zoom"){
                        selectedPath.scale(1.1)
                    }else{
                        selectedPath.scale(0.9)
                }
            }else{
                let objPaths =  SVG(".icon-container-svg").find('path')
                objPaths.each(obj => {
                     if(type === "zoom"){
                            obj.scale(1.1)
                        }else{
                            obj.scale(0.9)
                    }
                    
                })
            }
        },
        rotateIcon(type){
           let selectedPath = SVG(".icon-container-svg .selected")
            if(selectedPath){
                if(type === "left"){
                    selectedPath.rotate(-45)
                }else{
                     selectedPath.rotate(45)
                }
               
            }else{
                let objPaths =  SVG(".icon-container-svg").find('path')
                objPaths.each(obj => {
                    if(type === "left"){
                        obj.rotate(-45)
                    }else{
                        obj.rotate(45)
                    }
                })      
            }
        },
        changeColorPicker(val){
            let obj = $(".icon-container-svg path.selected")
            if(!obj.length){
                $(".icon-container-svg path").attr('fill', val)
            }else{
                obj.attr('fill', val)
            }
        },
        revokeIcon(){
            this.svgCodeIndex = ++ this.svgCodeIndex
            this.operationElementSvg()
        },
        next(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let content = $(".icon-container-svg path").removeClass('selected').parents('.icon-container-svg').html()
                    if(this.type === "myProjects"){
                        editProjectIcons({
                            ...this.form,
                            content
                        }).then(res=>{
                            if(res.code === 200){
                                this.dialogVisible = false
                                this.$emit('newGetProjects')
                                this.$message.success("图标修改成功！")
                            }
                        })
                    }else{
                        editIcons({
                            ...this.form,
                            content
                        }).then(res => {
                            if(res.code === 200){
                                this.dialogVisible = false
                                this.$emit('newGetProjects')
                                this.$message.success("图标修改成功！")
                            }
                        })
                    }
                }else{
                    return false;
                }
            })
        },
        beforeEnter(el) {
            // 设置transform值
            el.style.opacity = 0;
            el.style.transform = 'translate(0, 0)'
       },
        afterEnter(el) {
            // 设置透明度
            el.style.opacity = 1;
            setTimeout(()=>{
                this.count +=1;
            },810)
        },
        enter(el, done) {
            el.offsetWidth;
            // 获取徽标在页面中的位置
            let badgePosition = document.getElementById('appCart').getBoundingClientRect();
            const xDist = badgePosition.left - this.elLeft - 10;
            const yDist = badgePosition.top - this.elTop;
            el.style.transform = `translate(${xDist}px, ${yDist}px)`;
            el.style.transition = 'all 0.8s cubic-bezier(0.12,0.78,0.53,0.92)';
            this.showMoveDot = this.showMoveDot.map(() => false);
            done()
        },
        addToCart(event, item){
            let type = 'remove'
            if(!item.status){
            type = 'add'
            this.showMoveDot = [...this.showMoveDot, true];
            // //显示图片
            this.imgUrl = item.content;
            this.elLeft = event.target.getBoundingClientRect().left;
            this.elTop = event.target.getBoundingClientRect().top + 20;
            }
            item.status = !item.status
            this.$emit('addIcons', type, item)
      }
    }
}
</script>

<style lang="less">
.m-form .el-form-item__label{
    color: #333;
}
.u-icon-svg svg, .move_dot svg{
    font-size: 36px;
    color: #666;
    width: 1em;
    height: 1em;
    vertical-align: middle;
    fill: currentColor;
    overflow: hidden;
}
.icon-container-svg svg{
    width: 100%!important;
    height: 100%!important;
    color: #333!important;
    path{
        cursor: pointer;
    }
    path.selected{
        stroke: #666;
        stroke-dasharray: 20;
        stroke-width: 5;
    }
}
.u-input-text input{
    color: #333;
    background-color: #f8f9fa;
    border-color: #f8f9fa;
}
.u-colorPicker{
    position: absolute;
    top: 3px;
    left: 200px;
    background: #f8f9fa;
    .el-color-picker__trigger{
        border: 1px solid #f8f9fa;
    }
}
</style>

<style lang="less" scoped>
.m-icons{
    position: relative;
    overflow: auto;
    z-index: 1;
    .u-item{
        margin-bottom: 20px;
        position: relative;
        cursor: pointer;
        height: 137px;
        &:hover .icon-cover{
            display: block;
        }
    }
    .u-icon-svg{
        display: flex;
        justify-content: center;
        padding: 18px 5px 0;
        text-align: center;
    }
    
    .icon-cover{
        width: 100%;
        height: 100%;
        background: #409EFF;
        position: absolute;
        top: 0;
        left: 0;
        display: none;
        overflow: hidden;
        vertical-align: middle;
        border-radius: 5px;
        .cover-item{
            width: 50%;
            height: 52.5px;
            line-height: 52.5px;
            text-align: center;
            color: #fff;
            font-size: 22px;
            display: inline-block;
            cursor: pointer;
            &:hover{
                background: #0084e2;
                font-weight: bold;
                box-shadow: inset -5px 5px 5px #4575cc;
                font-weight: bold;
            }
        }
        .cover-copy{
            font-size: 12px;
            &:hover{
                background: #0084e2;
                box-shadow: inset -5px 5px 5px #4575cc;
                font-weight: bold;
            }
        }
        .cover-code{
            height: 28px;
            line-height: 26px;
            color: #fff;
            cursor: pointer;
            margin: 2px;
        }
    }
    .icon-base-view{
        margin: 0 auto;
        width: 100px;
        height: 100%;
        position: relative;
        text-align: center;
        border: 1px dashed transparent;
        border-radius: 5px;
        .icon-name,.icon-code{
            padding: 0 5px;
            height: 20px;
            line-height: 20px;
            color: #666;
            font-size: 12px;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .icon-name{
            margin-top: 20px;
        }
        .icon-code{
            margin-top: 2px;
        }
        &:hover{
            .u-delete{
                display: block;
            }
        }
        
    }
    .icon-base-selected{
        border-color: #60606d;
    }
}

.m-editIcon{
    padding: 0 20px;
}

.m-edit-button{
    text-align: right;
}

.icon-container{
    position: relative;
    background-image: linear-gradient(90deg, rgba(200, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%), linear-gradient(rgba(200, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%);
    background-size: 10px 10px;
    border-radius: 4px;
    border-right: 1px solid rgba(200, 0, 0, 0.15);
    border-bottom: 1px solid rgba(200, 0, 0, 0.15);
    .icon-container-svg{
        height: 450px;
        align-items: center;
        justify-content: center;
    }
    .icon-container-tool{
        position: absolute;
        top: 5px;
        left: 1px;
        span{
            margin-right: 5px;
            padding: 5px 10px;
            background: #f8efef;
            box-shadow: 2px 2px #ccc;
            border-radius: 3px;
            cursor: pointer;
            color: #333;
            user-select: none;
            &:hover{
                color: #409EFF;
            }
        }
    }
}

.u-rotatexuanzhuan{
    cursor: pointer;
    font-size: 36px;
    margin-right: 30px;
    color: #999;
    user-select: none;
    &:hover{
        color: #409EFF;
    }
}

 .move_dot {
        width: 50px;
        height: 50px;
        /*border-radius: 50%;*/
        /*background-color: #00b38a;*/
        position: fixed;
        z-index: 99;
        img {
            animation: 0.8s move ease-in-out;
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }
    }
    @keyframes move {
        0% {
            transform: scale(1);
        }
        25% {
            transform: scale(0.8);
        }
        50% {
            transform: scale(0.6);
        }
        75% {
            transform: scale(0.4);
        }
        100% {
            transform: scale(0.2);
        }
    }
    @-moz-keyframes move {
        0% {
            transform: scale(1);
        }
        25% {
            transform: scale(0.8);
        }
        50% {
            transform: scale(0.6);
        }
        75% {
            transform: scale(0.4);
        }
        100% {
            transform: scale(0.2);
        }
    }
    @-webkit-keyframes move {
        0% {
            transform: scale(1);
        }
        25% {
            transform: scale(0.8);
        }
        50% {
            transform: scale(0.6);
        }
        75% {
            transform: scale(0.4);
        }
        100% {
            transform: scale(0.2);
        }
    }
    @-o-keyframes move {
        0% {
            transform: scale(1);
        }
        25% {
            transform: scale(0.8);
        }
        50% {
            transform: scale(0.6);
        }
        75% {
            transform: scale(0.4);
        }
        100% {
            transform: scale(0.2);
        }
    }


</style>