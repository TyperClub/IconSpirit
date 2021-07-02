<template>
<el-container style="height: 100%;">
    <el-header style="text-align: right; font-size: 12px">
        <navigation></navigation>
    </el-header>
    <div class="home">
        <div class="m-content">
            <div class="m-row-user">
                <div class="user-logo">
                     <el-avatar class="logo" :size="100" :src="circleUrl"></el-avatar>
                    <!-- <img src="https://sf6-ttcdn-tos.pstatp.com/img/user-avatar/693bcc26e2e1cb5cff0157182fd7f319~300x300.image" alt=""> -->
                </div>
                <div class="user-info">
                    <div>欢迎，{{username}}</div>
                    <p class="f-size-14"><i class="opsfont ops-xinxi"></i> {{userInfo.occupation}} | {{userInfo.department}}</p>
                </div>
                <div class="m-tool">
                    <div class="create-project"><span @click="createProject"><i class="el-icon-plus"></i> 创建项目</span> <span @click="transfer"><i class="opsfont ops-migrate"></i> 迁入项目</span></div>
                </div>
            </div>
            <el-tabs class="m-menu padding-top-20" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane name="1">
                    <template #label>
                        <span><i class="opsfont ops-base_itemxiangmuguanli"></i> 我的项目</span>
                    </template>
                    <div class="m-project-box">
                        <div class="m-project">
                            <div class="u-project">
                                <div><i class="el-icon-menu menu"></i><span class="project-title">我发起的项目</span></div>
                                <div class="project-list">
                                    <div class="item" @click="rowItem(index)" :class="current === index ? 'current' : ''"  v-for="(item, index) in ownList" :key="index"><span>{{item.name}}</span></div>
                                </div>
                            </div>
                            <!-- <div class="u-project">
                                <div><i class="el-icon-menu menu"></i><span class="project-title">我参入的项目</span></div>
                                <div class="project-list">
                                    <div class="item"><span>ops-ui</span></div>
                                    <div class="item"><span>测试项目</span></div>
                                </div>
                            </div> -->
                            <div class="u-project">
                                <div class="delete-project"><i class="el-icon-menu menu"></i><span class="project-title">我删除的项目</span></div>
                            </div>
                        </div>
                        <div class="m-project-tool" v-if="ownList.length">
                            <div class="tool">
                                <div class="tool-left">
                                    <b>{{ownList[current] && ownList[current].name}}</b>
                                    <span>{{ownList[current] && ownList[current].icons.length}} 个图标</span>
                                    <span><i class="el-icon-time"></i> {{ownList[current] && ownList[current].create_at}}</span>
                                    <span class="tool-1"><i class="el-icon-setting"></i> 项目设置</span>
                                    <span class="tool-1"><i class="opsfont ops-log"></i> 操作日志</span>
                                    <span @click="deleteProjects(ownList[current])" class="tool-1"><i class="el-icon-delete"></i> 删除项目</span>
                                    <span class="tool-1"><i class="opsfont ops-huishouzhan"></i> 回收站</span>
                                </div>
                                <div class="tool-right">
                                    <span class="u-invitation" @click="invitation(ownList[current])"><i class="opsfont ops-chengyuan"></i> 成员：<i class="el-icon-user user"></i> x 3 <i class="el-icon-arrow-down"></i></span>
                                </div>
                            </div>
                            <div class="project-code" 
                            v-loading="loading"
                            element-loading-text="代码生成中..."
                            >
                                <div class="help">
                                    <span><i class="opsfont ops-shiyongbangzhu1"></i> 使用帮助</span>
                                </div>
                                <div class="project-code-warp">
                                   <div class="css-path" :class="ownList && ownList[current] && ownList[current].font && ownList[current].font.fontIsOld && 'font-old'" v-if="ownList && ownList[current] && ownList[current].font && ownList[current].font.cssFile">
                                       <a target="_blank" id="cssPath" :href="ownList[current].font.website + ownList[current].font.cssFile">{{ownList[current].font.website + ownList[current].font.cssFile}}</a>
                                    </div>
                                   <div class="css-path" v-else> <span class="operation-generate" @click="generateFont"> <i class="opsfont ops-gengxin"></i> 暂无代码，点此生成</span></div>
                                   <div class="copy" v-if="ownList && ownList[current] && ownList[current].font && ownList[current].font.cssFile">
                                        <span v-if="ownList && ownList[current] && ownList[current].font && ownList[current].font.fontIsOld" class="operation-generate" @click="generateFont"> <i class="opsfont ops-gengxin"></i> 更新代码</span>
                                        <span class="copy-code" data-clipboard-target="#cssPath" @click="copyCode"><i class="opsfont ops-fuzhi"></i> 复制代码</span> 
                                    </div>
                                </div>
                            </div>
                            <el-row class="m-icons" v-show="ownList && ownList[current] && ownList[current].icons">
                                <el-col :span="3" class="u-item" v-for="(item, index) in ownList[current] && ownList[current].icons" :key="index">
                                    <div class="icon-base-view">
                                        <div class="u-icon-svg" v-html="item.content"></div>
                                        <p class="icon-name">{{item.CH_Name}}</p>
                                        <p class="icon-code">{{ownList[current].prefix + item.ENG_Name}}</p>
                                        <div class="icon-cover">
                                            <i title="添加入库" class="opsfont ops-03 cover-item"></i>
                                            <i title="编辑" class="el-icon-edit cover-item"></i>
                                            <i title="删除" @click="deleteIcon(item)" class="el-icon-delete cover-item"></i>
                                            <i title="下载" @click="downIcon(item)" class="opsfont ops-xiazai cover-item"></i>
                                            <div class="cover-code cover-copy">
                                                <span class="copy-code2" :aria-label="ownList[current].prefix + item.ENG_Name" @click="copyCode2"><i class="opsfont ops-fuzhi"></i> 复制代码</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                            <div class="m-icons-default" v-if="ownList && ownList[current] && ownList[current].icons.length === 0">
                                <div>
                                    <img src="https://img.alicdn.com/tfs/TB1PhV7uoY1gK0jSZFMXXaWcVXa-164-142.svg">
                                </div>
                                <p>暂时木有内容呀～～</p>
                            </div>
                            <div class="u-department">
                                效能研发组
                            </div>
                        </div>
                        <div class="m-project-tool" v-else>
                            <div class="m-create-icons-projects">
                                <span @click="createProject"><i class="el-icon-plus"></i> 创建项目</span> 
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane name="2">
                    <template #label>
                        <span><i class="opsfont ops-shoucang"></i> 我的收藏</span>
                    </template>
                    我的收藏
                </el-tab-pane>
                <el-tab-pane name="3">我的部门
                    <template #label>
                        <span><i class="opsfont ops-bumenguanli"></i> 我的部门</span>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
   
    </div>
    <el-dialog
    title="新建项目"
    v-model="dialogVisible"
    width="600px"
    :before-close="handleClose">
        <el-form  :model="form" :rules="rules" ref="form"  label-width="115px">
            <el-form-item label="项目名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入项目名" clearable></el-input>
            </el-form-item>
            <el-form-item label="项目描述">
                <el-input type="textarea" v-model="form.description" placeholder="请输入项目描述" clearable></el-input>
            </el-form-item>
            <el-form-item label="FontClass前缀" prop="prefix">
                <el-input v-model="form.prefix"  placeholder="请输入 FontClass 前缀，默认 icon-" clearable></el-input>
            </el-form-item>
            <el-form-item label="Font Family" prop="fontFamily">
                <el-input v-model="form.fontFamily" placeholder="请输入Font Family，默认 iconfont" clearable></el-input>
            </el-form-item>
            <el-form-item label="字体格式" prop="fontFormat">
                <el-checkbox-group v-model="form.fontFormat">
                <el-checkbox label="WOFF2" name="woff2"></el-checkbox>
                <el-checkbox label="WOFF" name="woff"></el-checkbox>
                <el-checkbox label="TTF" name="ttf"></el-checkbox>
                <el-checkbox label="EOT" name="eot"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">新建</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <el-dialog
        title="迁入项目"
        v-model="dialogVisible2"
        width="600px"
        custom-class="m-transferBox"
        :before-close="handleClose">
       <transfer></transfer>
    </el-dialog>
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
                reserve-keyword
                :remote-method="remoteInvitation"
            >
                <el-option
                v-for="item in invitations"
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
                        <span class="username">杨韦韦</span>
                        <span class="email">weiwei.yang@zhangmen.com</span>
                        <span class="operate">创建人</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</el-dialog>
</el-container>
</template>

<script>
import { mapState } from 'vuex'
import store from '../store'
import { createProjects, getProjects, generateFont, deleteProjectIcons, deleteProjects, queryUser } from '../services/index';
import Clipboard from 'clipboard'
import Navigation from './Navigation';
import Transfer from './Transfer'
import Moment from 'moment'

export default {
    data() {
      return {
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        dialogVisible: false,
        dialogVisible2: false,
        dialogVisible3: false,
        activeName: "1",
        ownList: [],
        current: 0,
        loading: false,
        invitationName: "",
        invitations: [],
        form: {
            name: "",
            description: "",
            fontFormat: ["WOFF2","WOFF","TTF"],
            fontFamily: "iconfont",
            prefix: "icon-"
        },
        rules:{
            name: [{ required: true, message: '请输入项目名', trigger: 'blur' }],
            fontFormat:[{ type: 'array', required: true, message: '请至少选择一个字体格式', trigger: 'change' }],
            fontFamily: [{ required: true, message: '请输入 Font Family', trigger: 'blur' }],
            prefix: [{ required: true, message: '请输入 FontClass 前缀', trigger: 'blur' }]
        }
      }
    },
    computed: {
        ...mapState({
            username: state => {
                return state.userInfo.userName
            },
            userInfo: state => state.userInfo
        })
    },
    mounted(){
        this.getProjects()
    },
    methods: {
        createProject(){
            this.dialogVisible = true
        },
        getProjects(){
            getProjects().then(res => {
                res.data && res.data.ownProjects && res.data.ownProjects.forEach(item => {
                    item.create_at = Moment(item.createDate).format("YYYY-MM-DD HH:mm")
                });
                this.ownList = res.data.ownProjects
                store.dispatch('setOwnProjects', res.data)
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
                        this.getProjects()
                    }
                })
            })
        },
        onSubmit(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    createProjects({
                        ...this.form
                    }).then(res=>{
                        if(res.code == 200){
                            this.dialogVisible = false
                            this.$refs.form.resetFields()
                            this.$message.success("创建成功！")
                            this.getProjects()
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        rowItem(index){
            this.current = index
        },
        transfer(){
            this.dialogVisible2 = true
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
                        this.getProjects()
                    }
                })
            })
        },
        downIcon(item){
            console.log(111, item)
        },
        generateFont(){
            if(this.ownList[this.current].icons.length === 0){
                this.$message.warning("图标不能为空！")
            }else{
                this.loading = true
                generateFont({
                id: this.ownList[this.current]._id
                }).then(res =>{
                    this.getProjects()
                    this.loading = false
                    console.log(111, res)
                }).catch(()=> {
                    this.loading = false
                })
            }
        },
        invitation(item){
            this.dialogVisible3 = true
        },
        remoteInvitation(query){
            if (query !== '') {
                queryUser({u: query}).then(res => {
                    this.invitations = res.data
                })
            }else{
                this.options = [];
            }
        }
    },
    components: {
      Navigation,
      Transfer
    }
  };
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
.f-fr{
  float: right;
}
.f-size-14{
    font-size: 14px;
}
.m-menu{
    position: relative;
}
.padding-top-20{
    padding-top: 20px;
}
.m-tool{
    position: absolute;
    right: 0;
    bottom: -50px;
    .create-project{
        cursor: pointer;
        font-size: 14px;
        span{
            padding-left: 10px;
             &:hover{
                color: #409EFF;
            }
        }
    }
}
.m-content{
    position: relative;
    max-width: 1240px;
    padding: 0 20px;
    margin: 120px auto 0;
}
.m-row-user{
    display: flex;
    align-items: center;
    z-index: 2;
    position: relative;
    max-width: 1200px;
    margin: 32px auto auto;
    .user-logo{
        margin-right: 25px;
        // width: 64px;
        // height: 64px;
        // border-radius: 50%;
        // overflow: hidden;
        .logo:hover{
            transform: rotate(666turn);
            transition-delay: 1s;
            transition-property: all;
            transition-duration: 59s;
            transition-timing-function: cubic-bezier(.34,0,.84,1);
        }
        img{
            width: 100%;
            height: 100%;
        }
    }
    .user-info{
        div{
            font-weight: 600;
            color: #333;
            font-size: 24px;
            display: flex;
            align-items: center;
        }
        p{
            padding-top: 10px;
            color: #999;
            font-size: 14px;
        }
    }
}
.m-project-box{
    display: flex;
    padding: 10px 0 15px;
    min-height: 340px;
}
.m-project{
    width: 200px;
    border-right: 1px solid #ccc;
}
.u-project{
    font-size: 14px;
    color: #999;
    margin-bottom: 25px;
    .project-title{
        padding-left: 3px;
    }
    .project-list{
        margin-top: 12px;
        .item{
            padding-left: 18px;
            font-size: 12px;
            height: 35px;
            line-height: 35px;
            white-space: nowrap;
            width: 90px;
            overflow: hidden;
            color: #999;
            cursor: pointer;
            text-overflow: ellipsis;
        }
        .item :hover {
            color: #333;
        }
        .current{
            position: relative;
            color: #333;
            &:before{
                content: '';
                position: absolute;
                left: 3px;
                top: 50%;
                margin-top: -.5em;
                height: 1em;
                width: 2px;
                border-radius: 2px;
                background-color: #409EFF;
            }
        }
    }
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

.u-department{
    position: absolute;
    font-weight: 700;
    font-size: 36px;
    right: 20px;
    bottom: -10px;
    color: #e6e6e6;
    text-transform: uppercase;
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
.m-icons-default{
    padding-top: 10px;
    text-align: center;
    color: #666;
    p{
        padding-top: 15px;
    }
}
.m-create-icons-projects{
    width: 100%;
    height: 72px;
    display: flex;
    align-items: center;
    background: #f8f9fa;
    font-size: 16px;
    color: #409EFF;
    padding-left: 18px;
    margin-bottom: 16px;
    cursor: pointer;
    border-radius: 8px;
}
.delete-project{
    cursor: pointer;
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
        }
    }
}
</style>
