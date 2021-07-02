<template>
    <div class="m-project-tool">
        <div class="tool">
            <div class="tool-left">
                <b>{{projectList?.name}}</b>
                <span>{{projectList?.icons.length}} 个图标</span>
                <span><i class="el-icon-time"></i> {{projectList?.create_at}}</span>
                <span class="tool-1"><i class="el-icon-setting"></i> 项目设置</span>
                <span class="tool-1"><i class="opsfont ops-log"></i> 操作日志</span>
                <span @click="deleteProjects(projectList)" class="tool-1"><i class="el-icon-delete"></i> 删除项目</span>
                <span class="tool-1"><i class="opsfont ops-huishouzhan"></i> 回收站</span>
            </div>
            <div class="tool-right">
                <span class="u-invitation" @click="invitation(projectList)"><i class="opsfont ops-chengyuan"></i> 成员：<i class="el-icon-user user"></i> x {{ projectParticipants.length + 1 }} <i class="el-icon-arrow-down"></i></span>
            </div>
        </div>
        <div class="project-code" 
        v-loading="loading"
        element-loading-text="代码生成中..."
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
                        <i title="添加入库" @click="addToCart($event, item)" class="opsfont ops-03 cover-item"></i>
                        <i title="编辑" class="el-icon-edit cover-item"></i>
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
                        <span class="operate">创建人</span>
                    </div>
                    <div v-for="(item, index) in projectParticipants" :key="index">
                        <span class="username">{{item.userName}}</span>
                        <span class="email">{{item.userEmail}}</span>
                        <span @click="deleteInvitation(item)" class="operate operate-delete">移除</span>
                    </div>
                </div>
            </div>
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
import { deleteProjects, projectParticipantsList, deleteProjectIcons, generateFont, deleteProjectParticipants, addprojectParticipants, queryUser} from '../services/index';
import Clipboard from 'clipboard'

export default {
    props: ['projectList'],
    data(){
        return {
            dialogVisible3: false,
            projectParticipants: [],
            current: 0,
            loading: false,
            invitationName: "",
            invitations: [],
            showMoveDot: [],
            imgUrl:'',
            elLeft: 0, //当前点击购物车按钮在网页中的绝对top值
            elTop: 0, //当前点击购物车按钮在网页中的绝对left值
        }
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
                            message: '删除成功!'
                        });
                        this.$emit('newGetProjects')
                    }
                })
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
        deleteInvitation(item){
            deleteProjectParticipants({
                userEmail: item.userEmail,
                projectId: this.projectList._id
            }).then(res => {
                this.getProjectParticipantsList()
                console.log(111, res)
            })
        },
        changeInvitation(item){
            addprojectParticipants({
                id: item._id,
                projectId: this.projectList._id
            }).then(res =>{
                this.getProjectParticipantsList()
                console.log(111, res)
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
        downIcon(item){
            console.log(111, item)
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
        cursor: pointer;
        font-size: 14px;
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
    .operation-generate{
        cursor: pointer;
        &:hover{
            color: #409EFF;
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
            width: 100%;
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