<template>
<div>
<el-row class="m-header" style="wdith:100%">
    <el-col :span="6">
        <div class="m-logo">
            <a class="home-link" href="#">
                <img class="logo" :src="logoStatus ? require('../assets/IconSpiritd1.png') : require('../assets/IconSpiritd.png')" alt="">
                <!-- <span class="site-name" :class="logoStatus ? 'site-name-white': ''">IconSpirit</span>  -->
            </a>
        </div>
    </el-col>
    <el-col :class="logoStatus ? 'nav-right': ''" :span="18">
        <div class="grid-content f-fr">
            <span class="shopping"  @click="openDrawer" >
                 <el-badge :value="count" class="item">
                    <i id="appCart" class="opsfont ops-03"></i>
                </el-badge>
            </span>
            <!-- <i id="appCart" class="opsfont ops-03"></i> -->
            <i @click="uploadIcons" class="el-icon-upload icon-upload"></i>
            <el-button v-if="!username" class="login" @click="login" type="primary" size="mini" round>登录</el-button>
            <el-dropdown  v-if="username" trigger="click">
                <span class="userName">欢迎，{{username}} <i class="el-icon-arrow-down el-icon--right"></i></span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="feedback"> 意见反馈 </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <span v-if="username" class="logout"  @click="logout"><i class="opsfont ops-exit-5"></i> 退出</span>
        </div>
         <div class="m-nav-search f-fr">
            <el-input size="mini" class="search" v-model="searchName"  placeholder="请输入图标关键词" suffix-icon="el-icon-search"  @keyup.enter.prevent="querySearch($event)">
              <!-- <template #append><el-button size="mini" icon="el-icon-search" @click="querySearch('click')"></el-button></template> -->
            </el-input>
        </div>
        <div class="grid-center f-fr">
            <el-menu  :default-active="$route.path" class="el-menu-nav" mode="horizontal" @select="handleSelect">
                <el-menu-item @click="projects('/home')" index="/home">首页</el-menu-item>
                <el-menu-item @click="projects('/search')" index="/search">图标库</el-menu-item>
                <el-menu-item v-if="!username" @click="projects('/projects')">项目管理</el-menu-item>
                <el-menu-item v-else @click="projects('/projects')"  index="/projects">项目管理</el-menu-item>
                <el-menu-item class="u-menu-nav"  @click="projects('/help')" index="/help">使用指南</el-menu-item>
                <el-menu-item class="u-menu-nav" @click="projects('/gitlab')" index="/gitlab"><span class="u-gitlab"><i class="opsfont ops-other67b7b"></i> <b>GitLab</b></span></el-menu-item>
            </el-menu>
        </div>
    </el-col>
</el-row>
    <el-drawer
        modal-class="m-drawer"
        size="350px"
        v-model="drawer"
        :with-header="false"
        :direction="direction"
        destroy-on-close>
        <div class="m-shopping">
            <div class="u-close"  @click="drawer = false"><i class="el-icon-close"></i></div>
            <div class="shopping-header">
                <span class="shopping-num">共 <b>{{count}}</b> 个图标</span>
                <span class="clear" @click="clearIcons"><i class="opsfont ops-Eliminate"></i> 一键清除</span>
            </div>
            <div class="m-icons">
                <el-row v-if="icons.length">
                    <el-col :span="6" class="u-item" v-for="(item, index) in icons" :key="index">
                        <div class="icon-base-view">
                            <div class="u-icon-svg" v-html="item.content"></div>
                            <p class="icon-name">{{item.CH_Name}}</p>
                            <div class="u-delete" @click="deleteIcon(item)"><i class="el-icon-delete"></i></div>
                        </div>
                    </el-col>
                </el-row>
                <div class="u-shopping-empty" v-else>
                    <div class="icons-shopping">
                        <i class="opsfont ops-03"></i>
                    </div>
                    <p>赶快把喜欢的图标加入购物车</p>
                </div>
            </div>
            <div class="m-icons-project" v-if="username">
                <div class="title">
                    <span>{{isCreateProject ? '加入新项目': '加入项目'}}</span>
                    <i @click="createProject" title="新建项目" class="right-icon" :class="isCreateProject ? 'opsfont ops-fanhui': 'el-icon-folder-add'"></i>
                </div>
                <div class="project-list">
                    <div v-if="isCreateProject">
                        <el-input prefix-icon="el-icon-folder" class="new-project" size="small" v-model="newProjectName" type="text" placeholder="您没有新的项目，请输入新项目名称" clearable></el-input>
                    </div>
                    <div v-else>
                        <ul v-if="ownProjects.length">
                            <li  @click="rowItem(index)" :class="current == index ? 'current' : ''" v-for="(item, index) in ownProjects" :key="index">
                                <i :class="current == index ? 'el-icon-folder-checked' : 'el-icon-folder'"></i>
                                <span>{{item.name}}</span>
                                <span class="f-department">{{item.department || '技术部'}}</span>
                            </li>
                        </ul>
                        <div v-else class="u-tips">您还没有新的项目，赶紧创建新项目</div>
                    </div>
                </div>
                <div class="icon-manage-bottom">
                    <el-button class="icon-manage-bottom-left" type="primary" :disabled="!icons.length" @click="addIconsToProject" size="small" round>确定</el-button>
                    <el-button :disabled="!icons.length" @click="drawer = false" size="small" round>取消</el-button>
                </div>
            </div>
            <div class="m-icons-project" v-else>
                <div class="icons-tool">
                    <el-button @click="login" class="icon-item" round>添加至项目</el-button>
                </div>
            </div>
        </div>
    </el-drawer>
    <el-dialog
        custom-class="m-login"
        v-model="dialogVisible"
        width="400px">
        <login></login>
    </el-dialog>
</div>
</template>

<script>
import Login from './Login';
import { logout, addProjectIcons, createIconsAndProjects } from '../services/index';
import { mapState } from 'vuex'

export default {
    name: "Navigation",
    props: {
        logoStatus: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        let icons = window.sessionStorage.getItem('ops-icons')
        icons = icons ? JSON.parse(icons) : []
        return {
            dialogVisible: false,
            isCreateProject: false,
            newProjectName: "",
            searchName: "",
            activeIndex: '2',
            count: icons.length,
            icons: icons,
            drawer: false,
            current: 0,
            direction: 'rtl',
        }
    },
    computed: {
        ...mapState({
            username: state => state.userInfo.userName,
            ownProjects: state =>{
                state.ownProjects.ownProjects.forEach(obj => {
                    obj.type = 'own'
                });
                state.ownProjects.corpProjects.forEach(obj => {
                    obj.type = 'corp'
                })
                return [...state.ownProjects.ownProjects, ...state.ownProjects.corpProjects]
            }
        })
    },
    methods: {
        querySearch(e){
            if(e === "click"){
                this.$emit('searchIcons',this.searchName)
                if(this.$route.path != '/search'){
                    this.$router.push({
                        name: 'search',
                        query: {
                            search: this.searchName
                        }
                    })
                }
            }else{
                let keyCode = window.event ? e.keyCode : e.which;
                if (keyCode == 13) {
                    this.$emit('searchIcons',this.searchName)
                    if(this.$route.path != '/search'){
                        this.$router.push({
                            name: 'search',
                            query: {
                                search: this.searchName
                            }
                        })
                    }
                }
            }
        },
        feedback(){
            window.open('https://github.com/Baiang/IconSpirit/issues','target','');
        },
        clearIcons(){
            window.sessionStorage.setItem('ops-icons', '')
            this.icons = []
            this.count = 0
            this.$emit('deleteSelectIcon', 'all')
        },
        deleteIcon(item){
            let icons = window.sessionStorage.getItem('ops-icons')
            icons = icons ? JSON.parse(icons) : []
            icons = icons.filter(function(obj){
                return obj.id != item.id
            })
            window.sessionStorage.setItem('ops-icons', JSON.stringify(icons))
            this.icons = icons
            this.count = icons.length
            this.$emit('deleteSelectIcon', 'single', item)
        },
        addIcons (type, item) {
            let icons = window.sessionStorage.getItem('ops-icons')
            if(type === "add"){
                if(!icons){
                    icons = [item]
                    window.sessionStorage.setItem('ops-icons', JSON.stringify(icons))
                }else{
                    icons = JSON.parse(icons)
                    icons.push(item)
                    window.sessionStorage.setItem('ops-icons', JSON.stringify(icons))
                }
                this.icons = icons
                setTimeout(()=>{
                    this.count = icons.length
                },810)
            }else{
                if(icons){
                    icons = JSON.parse(icons)
                    icons = icons.filter(function(obj){
                       return obj.id != item.id
                    })
                    window.sessionStorage.setItem('ops-icons', JSON.stringify(icons))
                    this.icons = icons
                    this.count = icons.length
                }
            }
        },
        addIconsToProject(){
            if(this.isCreateProject){
                if(!this.newProjectName){
                    this.$notify({
                        title: '警告',
                        message: '新项目名称不能为空!',
                        type: 'warning'
                    });
                }else{
                    createIconsAndProjects({
                        projectName: this.newProjectName,
                        icons: this.icons
                    }).then(res => {
                        if(res.code === 200){
                            window.sessionStorage.removeItem('ops-icons')
                            this.drawer = false
                            this.count = 0
                            this.icons = []
                            this.$message.success("添加成功!")
                            this.$emit('addIconsShopping')
                            this.$router.push({
                                path: '/projects',
                                query: {
                                    type: 'own',
                                    id: res.data._id
                                }
                            })
                        }
                    })
                }
            }else{
                if(this.icons.length){
                    let id = this.ownProjects[this.current]._id
                    addProjectIcons({
                        id,
                        icons: this.icons
                    }).then(res =>{
                        if(res.code === 200){
                            window.sessionStorage.removeItem('ops-icons')
                            this.drawer = false
                            this.count = 0
                            this.icons = []
                            this.$message.success("添加成功!")
                            this.$emit('addIconsShopping')
                            this.$router.push({
                                path: '/projects',
                                query: {
                                    type: this.ownProjects[this.current].type,
                                    id
                                }
                            })
                        }
                    })
                }
            }
        },
        projects(name){
            if(name === "/gitlab"){
                window.open('https://github.com/Baiang/IconSpirit','target','');
                return
            }
            if(name === "/projects" && !this.username){
                this.dialogVisible = true
            }else{
                this.$router.push(name)
            }
        },
        createProject(){
            this.isCreateProject = !this.isCreateProject
        },
        openDrawer(){
            this.drawer = !this.drawer
            if(this.ownProjects.length === 0){
                this.isCreateProject = true
            }
            this.$emit("openDrawer")
        },
        rowItem(index){
            this.current = index
        },
        uploadIcons(){
            if(!this.username){
                this.dialogVisible = true
            }else{
                this.$router.push("upload")
            }
        },
        login(){
            this.dialogVisible = true
        },
        logout(){
            logout().then(() => {
                location.reload()
            })
        }
    },
    components: {
        Login
    }
}
</script>

<style lang="less">
.m-login{
    text-align: left;
}
.m-drawer{
    background-color: initial;
    text-align: left;
    top: 60px;
    .el-drawer{
        overflow: initial;
        box-shadow: 0 12px 12px 0 rgba(0, 0, 0, 0.1);
    }
    .icon-base-view .icon{
        font-size: 28px;
    }
}
.el-menu-nav{
    border-bottom: none !important;
}
</style>
<style lang="less" scoped>
.f-fr{
  float: right;
}
.m-header{
      height: 60px;
      box-shadow: 0 2px 8px #f0f1f2;
      z-index: 101;
    }
.m-logo{
    text-align: left;
    .home-link{
        display: flex;
        align-items: center;
        line-height: 4rem;
        text-decoration: none
    }
    .logo{
        height: 28px;
        line-height: 28px;
        margin: 0 .8rem 0 2.4rem;
        vertical-align: middle;
        top: 16px;
        image-rendering: crisp-edges;
        position: relative;
    }
    .site-name{
        font-size: 1.3rem;
        font-weight: 500;
        color: #2a2a2a;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .site-name-white{
        color: #fff;
    }
}
.m-login{
    text-align: left;
}
.nav-right{
    background: #fff;
}
.grid-content{
    font-size: 1.1rem;
    line-height: 60px;
    padding: 0px 20px;
    .shopping{
        cursor: pointer;
        padding-top: 16px;
        line-height: 20px;
        &:hover{
            color: #409EFF;
        }
    }
    .upload{
        cursor: pointer;
    }
    .login{
        margin-left: 10px;
    }
    .userName{
        padding-left: 5px;
        font-size: 14px;
    }
    .logout{
        padding-left: 10px;
        font-size: 14px;
        &:hover{
            cursor: pointer;
            color: #409EFF;
        }
    }
}
.m-nav-search{
    line-height:  60px;
    .search{
        width: 200px;
    }
}
.ops-03{
    cursor: pointer;
    font-size: 22px;
    font-weight: bold;
}
.icon-upload{
    cursor: pointer;
    top: 4px;
    position: relative;
    font-size: 26px;
    padding: 0 4px;
    margin-left: 15px;
    &:hover{
        color: #409EFF;
    }
}
.m-drawer{
    position: relative;
    span{
        text-align: left;
        font-size: 14px;
    }
}
.m-shopping{
    position: relative;
    height: 100%;
    .shopping-header{
        width: 100%;
        border-bottom: 1px solid #eee;
        position: relative;
        clear: both;
        display: flex;
        justify-content: space-between;
        .shopping-num{
            line-height: 28px;
            padding-left: 10px;
        }
        .clear{
            cursor: pointer;
            height: 28px;
            line-height: 28px;
            padding: 0px 10px 0 0;
            &:hover{
                color: #409EFF;
            }
        }
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
.m-icons{
    position: relative;
    height: 350px;
    padding: 10px;
    background: #fcfcfc;
    overflow: auto;
    .u-item{
        position: relative;
        cursor: pointer;
        padding: 10px 0;
    }
    .u-icon-svg{
        text-align: center;
        display: flex;
        justify-content: center;
    }
    .u-delete{
        display: none;
        width: 60px;
        height: 65px;
        line-height: 75px;
        text-align: center;
        position: absolute;
        top: 0px;
        left: 11px;
        z-index: 1;
        color: #fff;
        background: rgba(64,158,255, 0.9);
        border-radius: 3px;
        .el-icon-delete{
            font-size: 30px;
        }
    }
    .u-shopping-empty{
        margin-top: 64px;
        text-align: center;
        .icons-shopping{
            width: 120px;
            height: 120px;
            margin: 0 auto;
            line-height: 120px;
            border-radius: 50%;
            background: #eee;
            text-align: center;
        }
        .ops-03{
            color: #fff;
            font-size: 70px;
        }
        p{
            padding-top: 30px;
        }
    }
    .icon-base-view{
        margin: 0 auto;
        width: 60px;
        text-align: center;
        .icon-name{
            padding-top: 6px;
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
        &:hover{
            .u-delete{
                display: block;
            }
        }
        
    }
}

.m-icons-project{
    height: 380px;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background: #fafafa;
    z-index: 2;
    // padding: 10px 0;
    .title{
        position: relative;
        padding-left: 10px;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        .right-icon{
            position: absolute;
            right: 20px;
            top: 0px;
            line-height: 50px;
            color: #666;
            font-size: 20px;
            cursor: pointer;
            &:hover{
                color: #409EFF;
            }
        }
    }
    .project-list{
        height: 190px;
        overflow: auto;
        .u-tips{
            padding-top: 20px;
            text-align: center;
        }
    }
    .new-project{
        margin-left: 20px;
        margin-top: 10px;
        width: 300px;
    }
    .current{
        background: #E8F3FF;
        border: 1px solid #409EFF;
    }
    li{
        padding-left: 20px;
        height: 35px;
        line-height: 35px;
        border: 1px solid #fafafa;
        border-radius: 5px;
        cursor: pointer;
        span{
            padding-left: 5px;
        }
        &:hover{
            background: #E8F3FF;
        }
        .f-department{
            float: right;
            padding-right: 15px;
            font-size: 12px;
            color: #777;
        }
    }
    .icon-manage-bottom{
        height: 89px;
        line-height: 80px;
        padding-left: 20px;
        background: #f3f3f3;
    }
}
.icons-tool{
    padding-top: 60px;
    text-align: center;
    .icon-item{
        width: 200px;
    }
}
.u-gitlab{
    &:hover .ops-other67b7b{
        color: #303133;
    }
    i{
        font-size: 16px;
    }
    *{
        vertical-align: bottom;
    }
}
</style>