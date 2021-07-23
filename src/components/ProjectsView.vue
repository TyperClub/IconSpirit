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
            <div class="code-type">
                <el-radio-group size="mini" v-model="tabPosition">
                    <el-radio-button label="1">Unicode</el-radio-button>
                    <el-radio-button label="2">Font class</el-radio-button>
                    <el-radio-button label="3">Webpack</el-radio-button>
                </el-radio-group>
                <div class="help">
                    <span @click="help"><i class="opsfont ops-bangzhushouce"></i> 使用帮助</span>
                    <!-- <span class="padding-left-10"><i class="opsfont ops-code"></i> API 接口</span> -->
                </div>
            </div>
            <div class="project-code-warp">
                <div class="css-path" :class="projectList?.font.fontIsOld && tabPosition != '3' && 'font-old'" v-if="projectList?.font.cssFile">
                    <div v-if="tabPosition == 1">
                        <pre><code v-html="projectList.font.unicodeStyle" id="cssPath"></code></pre>
                    </div>
                    <a v-if="tabPosition == 2" target="_blank" id="cssPath" :href="projectList?.font.website + projectList?.font.cssFile">{{projectList?.font.website + projectList?.font.cssFile}}</a>
                    <div v-if="tabPosition == 3" id="cssPath">
                        {{`new webpack.ZmIconsCssFilePathPlugin("${projectList._id}")`}} 
                    </div>
                </div>
                <div class="css-path" v-else> <span class="operation-generate" @click="generateFont"> <i class="opsfont ops-gengxin"></i> 暂无代码，点此生成</span></div>
                <div class="copy" v-if="projectList && projectList.font && projectList.font.cssFile">
                    <span v-if="projectList && projectList.font.fontIsOld && tabPosition != 3" class="operation-generate" @click="generateFont"> <i class="opsfont ops-gengxin"></i> 更新代码</span>
                    <span class="copy-code" data-clipboard-target="#cssPath" @click="copyCode"><i class="opsfont ops-fuzhi"></i> 复制代码</span>
                    <span class="copy-code" v-if="tabPosition == 2" @click="downFont(projectList)"><i class="opsfont ops-xiazai"></i> 下载文件</span> 
                </div>
            </div>
        </div>
        <icons v-show="projectList && projectList.icons" :projectList="projectList" :tabPosition="tabPosition" @newGetProjects="newGetProjects" @addIcons="addIcons"></icons>
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
            <div class="m-history">
                <el-timeline>
                    <el-timeline-item :timestamp="item.updated_at" v-for="(item, index) in history" :key="index">
                        <p>{{`${item.creater} ${item.operationType}了${item.applicationType}：${item.content}`}}</p>
                    </el-timeline-item>
                </el-timeline>
            </div>
        </div>
    </el-drawer>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { 
    deleteProjects, 
    projectParticipantsList, 
    generateFont, 
    deleteProjectParticipants,
    addprojectParticipants, 
    queryUser, 
    downloadCssFile,
    getProjectsHistory
} from '../services/index';
import Clipboard from 'clipboard'
import '@svgdotjs/svg.draggable.js'
import Moment from 'moment'
import Icons from "./Icons"

export default {
    props: ['projectList'],
    data(){
        return {
            dialogVisible3: false,
            drawer: false,
            tabPosition: "2",
            history: [],
            projectParticipants: [],
            current: 0,
            loading: false,
            invitationName: "",
            invitations: []
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
                   this.loading = false
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
        changeRowItem(){
            this.tabPosition = "2"
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
        newGetProjects(){
            this.$emit('newGetProjects')
        },
        openLog(){
            this.drawer = true
            getProjectsHistory({
                id: this.projectList._id
            }).then(res => {
                if(res.code === 200){
                    res.data &&  res.data.forEach(item => {
                        item.updated_at = Moment(item.updated_at).format("YYYY-MM-DD HH:mm")
                    });
                    this.history = res.data
                }
            })
        },
        closeDrawer(){
            this.drawer = false
        },
        editProjects(data){
            this.$emit('editProjects', data)
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
        generateFont(){
            if(this.projectList.icons.length === 0){
                this.$message.warning("图标不能为空！")
            }else{
                this.loading = true
                generateFont({
                id: this.projectList._id
                }).then(res =>{
                    if(res.code === 200){
                         this.$emit('newGetProjects')
                    }
                    this.loading = false
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
            filename = filename ? filename : item.font.cssFile.split("f/")[1]
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
        help(){
            this.$router.push('help')
        },
        addIcons(type, item){
            this.$emit('addIcons', type, item)
        }
    },
    components: {
        Icons
    }
}
</script>

<style lang="less">
.m-invitation{
    .el-dialog__body{
        padding-top: 0px;
    }
}
.code-type{
    .el-radio-button__orig-radio:checked+.el-radio-button__inner{
        color: #000;
        background-color: #fff;
    }
}
</style>

<style lang="less" scoped>
.padding-left-10{
    padding-left: 10px;
}
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
    .code-type{
        margin-bottom: 10px;
    }
    .help{
        float: right;
        padding-right: 5px;
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
        min-height: 20px;
        // line-height: 20px;
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

.notClick {
  color:grey !important;
  cursor:not-allowed !important;
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
    position: relative;
    height: 100%;
    .title{
        padding: 24px 0;
        font-size: 16px;
    }
}
.m-history{
    position: absolute;
    padding: 0 20px;
    top: 72px;
    bottom: 60px;
    left: 0;
    overflow-y: auto;
    width: 100%;
}
</style>