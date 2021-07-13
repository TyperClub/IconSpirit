<template>
    <div class="m-project-tool">
        <div class="tool">
            <div class="tool-left">
                <b>{{projectList?.name}}</b>
                <span>{{projectList?.icons.length}} 个图标</span>
                <span><i class="el-icon-time"></i> {{projectList?.create_at}}</span>
                <span @click="editProjects(projectList)" class="tool-1"><i class="el-icon-setting"></i> 项目设置</span>
                <span @click="openLog" class="tool-1"><i class="opsfont ops-log"></i> 操作日志</span>
                <span @click="deleteProjects(projectList)" class="tool-1"><i class="el-icon-delete"></i> 删除项目</span>
                <span class="tool-1"><i class="opsfont ops-huishouzhan"></i> 回收站</span>
            </div>
            <div class="tool-right">
                <span class="u-invitation" @click="invitation(projectList)"><i class="opsfont ops-chengyuan"></i> 成员：<i class="el-icon-user user"></i> x {{ projectParticipants.length + 1 }} <i class="el-icon-arrow-down"></i></span>
            </div>
        </div>
        <div class="project-code" 
        v-loading="loading"
        element-loading-text="正在努力生成代码中..."
        >
            <div class="help">
                <span @click="help"><i class="opsfont ops-bangzhushouce"></i> 使用帮助</span>
            </div>
            <div class="project-code-warp">
                <div class="css-path" :class="projectList?.font.fontIsOld && 'font-old'" v-if="projectList?.font.cssFile">
                    <a target="_blank" id="cssPath" :href="projectList?.font.website + projectList?.font.cssFile">{{projectList?.font.website + projectList?.font.cssFile}}</a>
                </div>
                <div class="css-path" v-else> <span class="operation-generate" @click="generateFont"> <i class="opsfont ops-gengxin"></i> 暂无代码，点此生成</span></div>
                <div class="copy" v-if="projectList && projectList.font && projectList.font.cssFile">
                    <span v-if="projectList && projectList.font.fontIsOld" class="operation-generate" @click="generateFont"> <i class="opsfont ops-gengxin"></i> 更新代码</span>
                    <span class="copy-code" data-clipboard-target="#cssPath" @click="copyCode"><i class="opsfont ops-fuzhi"></i> 复制代码</span>
                    <span class="copy-code" @click="downFont(projectList)"><i class="opsfont ops-xiazai"></i> 下载文件</span> 
                </div>
            </div>
        </div>
        <el-row class="m-icons" v-show="projectList && projectList.icons">
            <el-col :span="3" class="u-item" v-for="(item, index) in projectList && projectList.icons" :key="index">
                <div class="icon-base-view" :class="item.status ? 'icon-base-selected' : '' ">
                    <div class="u-icon-svg" v-html="item.content"></div>
                    <p class="icon-name">{{item.CH_Name}}</p>
                    <p class="icon-code">{{projectList.prefix + item.ENG_Name}}</p>
                    <div class="icon-cover">
                        <i title="添加入库" @click="addToCart($event, item)" :class="item.status ? 'ops-03f': 'ops-03'"  class="opsfont cover-item"></i>
                        <i title="编辑" @click="editIcon(item)" class="el-icon-edit cover-item"></i>
                        <i title="删除" @click="deleteIcon(item)" class="el-icon-delete cover-item"></i>
                        <i title="下载" @click="downIcon(item)" class="opsfont ops-xiazai cover-item"></i>
                        <div class="cover-code cover-copy">
                            <span class="copy-code2" :aria-label="projectList.prefix + item.ENG_Name" @click="copyCode2"><i class="opsfont ops-fuzhi"></i> 复制代码</span>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div class="m-icons-default" v-if="projectList && projectList.icons.length === 0">
            <div>
                <img src="https://img.alicdn.com/tfs/TB1PhV7uoY1gK0jSZFMXXaWcVXa-164-142.svg">
            </div>
            <p>暂时木有内容呀～～</p>
        </div>
        <div class="u-department">
            效能研发组
        </div>
 <el-dialog
    v-model="dialogVisible3"
    custom-class="m-invitation"
    width="600px"
    :before-close="handleClose">
    <div>
        <div class="search">
            <i class="opsfont ops-chengyuan"></i><span class="txt">项目成员管理：</span>
            <el-select 
                size="small" 
                v-model="invitationName" 
                placeholder="请输入中文名" 
                style="width: 300px;"
                filterable
                remote
                clear
                reserve-keyword
                :remote-method="remoteInvitation"
            >
                <el-option
                v-for="item in invitations"
                @click="changeInvitation(item)"
                :key="item.value"
                :label="item.label"
                :value="item.userName">
                    <span style="float: left">{{ item.userName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.department }}</span>
                </el-option>
            </el-select>
        </div>
        <div class="data-list">
            <div class="users">
                <div class="header">
                    <span class="username">用户名</span>
                    <span class="email">email</span>
                    <span class="operate">操作</span>
                </div>
                <div class="body">
                    <div>
                        <span class="username">{{projectList.creater}}</span>
                        <span class="email">{{projectList.userEmail}}</span>
                        <span class="operate" style="font-size: 12px; color: rgb(255, 152, 0);">创建人</span>
                    </div>
                    <div v-for="(item, index) in projectParticipants" :key="index">
                        <span class="username">{{item.userName}}</span>
                        <span class="email">{{item.userEmail}}</span>
                        <span @click="deleteInvitation(item, userInfo.userEmail === item.userEmail)" class="operate operate-delete" style="font-size: 12px; color: #409EFF;">
                            {{userInfo.userEmail === item.userEmail ? "退出": "移除"}}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</el-dialog>

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
                         <!-- <span><i class="opsfont ops-wenben"></i> 文本</span> -->
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

            <el-drawer
        modal-class="m-drawer"
        size="350px"
        v-model="drawer"
        :with-header="false"
        direction="rtl"
        destroy-on-close>
        <div class="m-log">
            <div class="u-close"  @click="drawer = false"><i class="el-icon-close"></i></div>
            <div class="title">项目操作日志</div>
            <el-timeline>
                <el-timeline-item timestamp="2018/4/12">
                    <p>杨韦韦 创建了项目</p>
                </el-timeline-item>
                <el-timeline-item timestamp="2018/4/3">
                    <p>杨韦韦 添加了图标：购物 </p>
                </el-timeline-item>
                <el-timeline-item timestamp="2018/4/3">
                    <p>杨韦韦 删除了图标：购物 </p>
                </el-timeline-item>
                <el-timeline-item timestamp="2018/4/2">
                    <p>杨韦韦 删除了项目</p>
                </el-timeline-item>
            </el-timeline>
        </div>
    </el-drawer>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { 
    deleteProjects, 
    projectParticipantsList, 
    deleteProjectIcons, 
    generateFont, 
    deleteProjectParticipants,
    addprojectParticipants, 
    queryUser, 
    downloadCssFile,
    editProjectIcons,
    getHistory
} from '../services/index';
import Clipboard from 'clipboard'
import { SVG } from '@svgdotjs/svg.js'
import '@svgdotjs/svg.draggable.js'
import $ from 'jquery'

export default {
    props: ['projectList'],
    data(){
        return {
            dialogVisible: false,
            dialogVisible3: false,
            drawer: false,
            svgCodeIndex: 0, //撤销次数
            svgCode: "",
            projectParticipants: [],
            current: 0,
            loading: false,
            invitationName: "",
            invitations: [],
            showMoveDot: [],
            imgUrl:'',
            elLeft: 0, //当前点击购物车按钮在网页中的绝对top值
            elTop: 0, //当前点击购物车按钮在网页中的绝对left值
            color: "",
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
    computed: {
        ...mapState({
            userInfo: state => state.userInfo
        })
    },
    watch: {
        projectList:{
            immediate:true,
            handler:function(data){
                if(data){
                   this.getProjectParticipantsList() 
                }
            }
        }
    },
    methods:{
        getProjectParticipantsList(){
            projectParticipantsList({
                projectId: this.projectList._id
            }).then(res =>{
                this.projectParticipants = res.data
            })
        },
        deleteProjects(item){
            this.$confirm('确定要删除此项目吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteProjects({
                    id: item._id
                }).then(res=>{
                    if(res.code === 200){
                        this.$message({
                            type: 'success',
                            message: '项目删除成功，可以从被删除项目中恢复!'
                        });
                        this.$emit('newGetProjects')
                    }
                })
            })
        },
        openLog(){
            getHistory({
                id: this.projectList._id
            }).then(res => {
                console.log(111, res)
            })
        },
        editProjects(data){
            this.$emit('editProjects', data)
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
                    return false;
                }
            })
        },
        copyCode(){
            let clipboard = new Clipboard('.copy-code')
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
        deleteIcon(item){
            this.$confirm('确定要删除图标吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
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
            })
        },
        generateFont(){
            if(this.projectList.icons.length === 0){
                this.$message.warning("图标不能为空！")
            }else{
                this.loading = true
                generateFont({
                id: this.projectList._id
                }).then(res =>{
                    this.$emit('newGetProjects')
                    this.loading = false
                    console.log(111, res)
                }).catch(()=> {
                    this.loading = false
                })
            }
        },
        invitation(){
            this.invitationName = ""
            this.options = []
            this.dialogVisible3 = true
        },
        deleteInvitation(item, status){
            deleteProjectParticipants({
                userEmail: item.userEmail,
                projectId: this.projectList._id
            }).then(res => {
                if(res.code === 200){
                    this.getProjectParticipantsList()
                    if(status === true){
                        this.dialogVisible3 = false
                        this.$emit('newGetProjects')
                    }
                }
            })
        },
        changeInvitation(item){
            addprojectParticipants({
                id: item._id,
                projectId: this.projectList._id
            }).then(res =>{
                if(res.code === 200){
                    this.getProjectParticipantsList()
                }
            })
        },
        remoteInvitation(query){
            if (query !== '') {
                queryUser({u: query}).then(res => {
                    this.invitations = res.data
                })
            }else{
                this.options = [];
            }
        },
        downFont(item){
            let filename = item.font.cssFile.split("font/")[1]
            downloadCssFile({id: item._id}).then(res => {
                const buf = Buffer.from(res.data.content, 'binary')
                let blob = new Blob([buf], {type: 'text/css'});
                let a = document.createElement('a')
                a.style.display = 'none';
                a.download = filename
                a.href = URL.createObjectURL(blob)
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
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
        help(){
            this.$router.push('help')
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
      },
    }
}
</script>

<style lang="less">
.icon {
  font-size: 36px;
  color: #666;
}
.m-invitation{
    .el-dialog__body{
        padding-top: 0px;
    }
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
.m-form .el-form-item__label{
    color: #333;
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
.m-project-tool{
    position: relative;
    width: 100%;
    padding-left: 20px;
    .tool{
        display: flex;
        justify-content: space-between;
        margin-bottom: 25px;
        b{
            font-size: 24px;
        }
        span{
            font-size: 14px;
            color: #999;
            margin-left: 20px;
        }
        .operation-log{
            padding-left: 20px;
        }
    }
    .tool-1{
        cursor: pointer;
        &:hover{
            color: #409EFF;
        }
    }
    .u-invitation{
        cursor: pointer;
    }
    .user{
        width: 18px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        background: #409EFF;
        color: #fff;
        border-radius: 50%;
    }
}

.project-code{
    .help{
        span{
            cursor: pointer;
            font-size: 14px;
            &:hover{
                color: #409EFF;
            }
        }
    }
}
.project-code-warp{
    margin-bottom: 20px;
    position: relative;
    padding: 16px;
    overflow: auto;
    font-size: 14px;
    line-height: 1.45;
    background-color: #f8f8fa;
    border-radius: 6px;
    margin-top: 8px;
    color: #032f62;
    .css-path{
        height: 20px;
        line-height: 20px;
        a{
            color: #333;
            text-decoration: none;
            text-underline-position: under;
            &:hover{
                color: #409EFF;
            }
        }
    }
    .font-old{
        opacity: 0.3;
    }
    .copy-code{
        color: #409EFF;
        &:hover{
            color: #0366d6 !important;
        }
    }
    .operation-generate{
        cursor: pointer;
        color: #409EFF;
        &:hover{
            color: #0366d6 !important;
        }
    }
    .copy{
        display: inline-block;
        position: absolute;
        top: 16px;
        right: 20px;
        span{
            cursor: pointer;
            padding-left: 20px;
            &:hover{
                color: #409EFF;
            }
        }
    }
}

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
        padding-top: 18px;
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
                background: #40b0ff;
                font-weight: bold;
            }
        }
        .cover-copy{
            font-size: 12px;
            &:hover{
                background: #40b0ff;
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

.u-department{
    position: absolute;
    font-weight: 700;
    font-size: 36px;
    right: 20px;
    bottom: -10px;
    color: #e6e6e6;
    text-transform: uppercase;
}

.search{
    .txt{
        padding-left: 5px;
        font-weight: bold;
    }
}
.data-list{
    margin-top: 15px;
    .users{
        border: 1px solid #dddfe6;
        border-radius: 3px;
        .header{
            line-height: 32px;
            border-bottom: 1px solid #dddfe6;
            span{
                display: inline-block;
                padding: 0 5px;
                font-weight: bold;
            }
            .username{
                width: 90px;
            }
            .email{
                width: 360px;
            }
        }
        .body{
            span{
                display: inline-block;
                padding: 8px 5px;
            }
            .username{
                width: 90px;
            }
            .email{
                width: 360px;
            }
            .operate-delete{
                cursor: pointer;
            }
        }
    }
}

.m-icons-default{
    padding-top: 10px;
    text-align: center;
    color: #666;
    p{
        padding-top: 15px;
    }
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
            &:hover{
                color: #409EFF;
            }
        }
    }
}

.m-editIcon{
    padding: 0 20px;
}
.m-edit-button{
    text-align: right;
}

.notClick {
  color:grey !important;
  cursor:not-allowed !important;
}

.u-rotatexuanzhuan{
    cursor: pointer;
    font-size: 36px;
    margin-right: 30px;
    color: #999;
    &:hover{
        color: #409EFF;
    }
}

.u-close{
    position: absolute;
    width: 30px;
    height: 30px;
    left: -30px;
    top: 0;
    color: #fff;
    background: #409EFF;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .el-icon-close{
        font-size: 16px;
        font-weight: 600;
    }
}
.m-log{
    padding: 0 20px;
    .title{
        padding: 24px 0;
        font-size: 16px;
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