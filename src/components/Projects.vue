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
                    <div class="create-project"><span @click="createProject"><i class="el-icon-plus"></i> 创建项目</span> <span><i class="opsfont ops-migrate"></i> 迁移项目</span></div>
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
                        </div>
                        <div class="m-project-tool">
                            <div class="tool">
                                <div class="tool-left">
                                    <b>{{ownList[current] && ownList[current].name}}</b>
                                    <span>{{ownList[current] && ownList[current].icons.length}} 个图标</span>
                                    <span><i class="el-icon-time"></i> {{ownList[current] && ownList[current].create_at}}</span>
                                    <span class="tool-1"><i class="el-icon-setting"></i> 项目设置</span>
                                    <span class="tool-1"><i class="opsfont ops-log"></i> 操作日志</span>
                                    <span class="tool-1"><i class="el-icon-delete"></i> 删除项目</span>
                                    <span class="tool-1"><i class="opsfont ops-huishouzhan"></i> 回收站</span>
                                </div>
                                <div class="tool-right">
                                    <span><i class="opsfont ops-chengyuan"></i> 成员：<i class="el-icon-user user"></i> x 3 <i class="el-icon-arrow-down"></i></span>
                                </div>
                            </div>
                            <div class="project-code">
                                <div class="help">
                                    <span><i class="opsfont ops-shiyongbangzhu1"></i> 使用帮助</span>
                                </div>
                                <div class="project-code-warp">
                                   <div>//at.alicdn.com/t/font_1825949_ar7xhw6zjrh.css</div>
                                    <div class="copy">
                                        <span @click="generateFont"> <i class="opsfont ops-gengxin"></i> 更新代码</span>
                                        <span><i class="opsfont ops-fuzhi"></i> 复制代码</span> 
                                    </div>
                                </div>
                            </div>
                            <el-row class="m-icons" v-show="ownList && ownList[current] && ownList[current].icons">
                                <el-col :span="3" class="u-item" v-for="(item, index) in ownList[current] && ownList[current].icons" :key="index">
                                    <div class="icon-base-view">
                                        <div class="u-icon-svg" v-html="item.content"></div>
                                        <p class="icon-name">{{item.CH_Name}}</p>
                                        <p class="icon-code">{{item.ENG_Name}}</p>
                                        <div class="icon-cover">
                                            <i title="添加入库" class="opsfont ops-03 cover-item"></i>
                                            <i title="编辑" class="el-icon-edit cover-item"></i>
                                            <i title="删除" class="el-icon-delete cover-item"></i>
                                            <i title="下载" class="opsfont ops-xiazai cover-item"></i>
                                            <div class="cover-code cover-copy">
                                                <span><i class="opsfont ops-fuzhi"></i> 复制代码</span>
                                            </div>
                                        </div>
                                        <!-- <div class="u-delete" @click="deleteIcon(item)"><i class="el-icon-delete"></i></div> -->
                                    </div>
                                </el-col>
                            </el-row>
                            <div class="u-department">
                                效能研发组
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
    width="500px"
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
</el-container>
</template>

<script>
import { mapState } from 'vuex'
import store from '../store'
import { createProjects, getProjects, generateFont } from '../services/index';
import Navigation from './Navigation';
import Moment from 'moment'

  export default {
    data() {
      return {
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        dialogVisible: false,
        activeName: "1",
        ownList: [],
        current: 0,
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
                res.data && res.data.forEach(item => {
                    item.create_at = Moment(item.createDate).format("YYYY-MM-DD HH:mm")
                });
                this.ownList = res.data
                store.dispatch('setOwnProjects', res.data)
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
        generateFont(){
            generateFont({
                id: this.ownList[this.current]._id
                }).then(res =>{
                    console.log(111, res)
                })
        }
    },
    components: {
      Navigation
    }
  };
</script>


<style lang="less">
.icon {
  font-size: 36px;
  color: #666;
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
    .user{
        width: 18px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        border: 1px solid #ccc;
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

</style>
