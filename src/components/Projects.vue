<template>
<el-container style="height: 100%;">
    <el-header style="text-align: right; font-size: 12px">
        <navigation ref="navigation" @deleteSelectIcon="deleteSelectIcon"></navigation>
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
                    <div class="create-project"><span @click="createProject"><i class="el-icon-plus"></i> 创建项目</span> <span @click="transfer"><i class="opsfont ops-migrate"></i> 迁入项目</span> <span><i class="opsfont ops-huishouzhan"></i> 被删除的项目</span></div>
                </div>
            </div>
            <el-tabs class="m-menu padding-top-20" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane name="1">
                    <template #label>
                        <span class="menu-title"><i class="opsfont ops-base_itemxiangmuguanli"></i> 我的项目</span>
                    </template>
                    <div class="m-project-box" v-if="ownList.length || corpList.length">
                        <div class="m-project">
                            <div class="u-project" v-if="ownList.length">
                                <div><i class="el-icon-menu menu"></i><span class="project-title">我发起的项目</span></div>
                                <div class="project-list">
                                    <div class="item" @click="rowItem(ownList[ownCurrent], index, 'own')" :class="ownCurrent === index && activeType === 'own' ? 'current' : ''"  v-for="(item, index) in ownList" :key="index"><span>{{item.name}}</span></div>
                                </div>
                            </div>
                            <div class="u-project" v-if="corpList.length">
                                <div><i class="el-icon-menu menu"></i><span class="project-title">我参入的项目</span></div>
                                <div class="project-list">
                                    <div class="item" @click="rowItem(corpList[corpCurrent], index, 'corp')" :class="corpCurrent === index && activeType === 'corp' ? 'current' : ''"  v-for="(item, index) in corpList" :key="index"><span>{{item.name}}</span></div>
                                </div>
                            </div>
                            <!-- <div class="u-project">
                                <div class="delete-project"><i class="el-icon-menu menu"></i><span class="project-title">我删除的项目</span></div>
                            </div> -->
                        </div>
                        <project-view v-if="activeType === 'own'" :project-list="ownList[ownCurrent]" @newGetProjects="newGetProjects" @addIcons="addIcons"></project-view>
                        <project-view v-if="activeType === 'corp'" :project-list="corpList[corpCurrent]" @newGetProjects="newGetProjects" @addIcons="addIcons"></project-view>
                    </div>
                    <div class="m-project-tool" @click="createProject" v-else>
                        <div class="m-create-icons-projects">
                            <span><i class="el-icon-plus"></i> 创建项目</span> 
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane name="2">
                    <template #label>
                        <span class="menu-title"><i class="opsfont ops-shoucang"></i> 我的收藏</span>
                    </template>
                    我的收藏
                </el-tab-pane>
                <el-tab-pane name="3">我的部门
                    <template #label>
                        <span class="menu-title"><i class="opsfont ops-bumenguanli"></i> 我的部门</span>
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
       <transfer ref="transfer" @closeTransfer="closeTransfer"></transfer>
    </el-dialog>
</el-container>
</template>

<script>
import { mapState } from 'vuex'
import store from '../store'
import { createProjects, getProjects } from '../services/index';
import Navigation from './Navigation';
import Transfer from './Transfer'
import ProjectView from './ProjectView'
import Moment from 'moment'

export default {
    data() {
      return {
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        dialogVisible: false,
        dialogVisible2: false,
        activeName: "1",
        activeType: "own",
        ownList: [],
        corpList: [],
        ownCurrent: 0,
        corpCurrent: 0,
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
            this.$refs.form.resetFields();
        },
        newGetProjects(){
            window.location.reload()
        },
        getProjects(){
            getProjects().then(res => {
                res.data && res.data.ownProjects && res.data.ownProjects.forEach(item => {
                    item.create_at = Moment(item.createDate).format("YYYY-MM-DD HH:mm")
                });
                res.data && res.data.corpProjects && res.data.corpProjects.forEach(item => {
                    item.create_at = Moment(item.createDate).format("YYYY-MM-DD HH:mm")
                });
                this.ownList = res.data.ownProjects
                this.corpList = res.data.corpProjects

                if(this.$route.query.type ===  'corp'){
                    res.data.corpProjects.forEach((obj,index) => {
                        if(obj._id === this.$route.query.id){
                            this.activeType = 'corp'
                            this.corpCurrent = index
                        }
                    });
                }else if(this.$route.query.type ===  'own'){
                    res.data.ownProjects.forEach((obj,index) => {
                        if(obj._id === this.$route.query.id){
                            this.activeType = 'own'
                            this.ownCurrent = index
                        }
                    });
                }
                
                if(!this.ownList.length && this.corpList.length && this.activeType === 'own'){
                    this.activeType = 'corp'
                    this.corpCurrent = 0
                }
                this.getSessionStorageIcons()
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
        rowItem(item, index, type){
            if(type === 'own'){
                this.ownCurrent = index
            }else{
                this.corpCurrent = index
            }
            this.activeType = type
            
            this.$router.push({
                path: '/projects',
                query: {
                    type: type,
                    id: item._id
                }
            })
            this.getSessionStorageIcons()
        },
        transfer(){
            this.dialogVisible2 = true
            this.$refs.transfer.init()
        },
        addIcons(type, item){
            this.$refs.navigation.addIcons(type, item)
        },
        deleteSelectIcon(type, item){
            let icons = this.activeType == "own" ? this.ownList[this.ownCurrent].icons : this.corpList[this.corpCurrent].icons
            icons.forEach(obj =>{
                if(type == "all"){
                    obj.status = false
                }else{
                    if(obj.id == item.id){
                        obj.status = false
                    }
                }
            })
            if(this.activeType == "own"){
                this.ownList[this.ownCurrent].icons = icons
            }else{
                this.corpList[this.corpCurrent].icons = icons
            }
        },
        getSessionStorageIcons(){
            let icons = window.sessionStorage.getItem('ops-icons')
            icons = icons ? JSON.parse(icons) : []
            let data = this.activeType == "own" ? this.ownList[this.ownCurrent].icons : this.corpList[this.corpCurrent].icons
            data.forEach(item => {
                item.status = false
                icons.forEach(obj =>{
                    if(obj.id  ==  item.id){
                        item.status  =  true
                    }
                })
            })

            if(this.activeType == "own"){
                this.ownList[this.ownCurrent].icons = data
            }else{
                this.corpList[this.corpCurrent].icons = data
            }
        },
        closeTransfer(){
            this.dialogVisible2 = false
            this.getProjects()
        }
    },
    components: {
      Navigation,
      Transfer,
      ProjectView
    }
  };
</script>


<style lang="less">
.icon {
  font-size: 36px;
  color: #666;
}
.el-tabs__content{
    overflow: auto;
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
.menu-title{
    padding-bottom: 5px;
    font-size: 14px;
    color: #666;
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
        margin-bottom: 5px;
        span{
            padding: 7px 10px;
            border-radius: 5px;
            &:hover{
                color: #409EFF;
                 background: rgba(25,103,210,.04);
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
.m-create-icons-projects{
    width: 100%;
    height: 72px;
    box-sizing: border-box;
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
</style>
