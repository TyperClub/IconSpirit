<template>
<div>
<el-row class="m-header" style="wdith:100%">
    <el-col :span="6">
        <div class="m-logo">
            <a class="home-link" href="#">
                <img class="logo" src="../assets/logo.png" alt="">
                <span class="site-name">OPS-ICONS</span> 
            </a>
        </div>
    </el-col>
    <el-col :span="18">
        <div class="grid-content f-fr">
            <span class="shopping"  @click="drawer = true" >
                 <el-badge :value="count" class="item">
                    <i id="appCart" class="opsfont ops-03"></i>
                </el-badge>
            </span>
            <!-- <i id="appCart" class="opsfont ops-03"></i> -->
            <i class="el-icon-upload icon-upload"></i>
            <el-button v-if="!username" class="login" @click="login" type="primary" size="mini" round>登录</el-button>
            <el-dropdown trigger="click" v-else>
                <span class="userName">欢迎，{{username}} <i class="el-icon-arrow-down"></i></span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="logout">
                            <span><i class="opsfont ops-dengchu_o"></i>退出</span></el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
         <div class="m-nav-search f-fr">
            <el-input size="mini" class="search" v-model="searchName" placeholder="输入图标关键词" @keyup.enter.prevent="querySearch($event)"  clearable>
              <template #append><el-button size="mini" icon="el-icon-search" @click="querySearch('click')"></el-button></template>
            </el-input>
        </div>
        <div class="grid-center f-fr">
            <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-menu-item @click="projects('/')" index="/">首页</el-menu-item>
                <el-menu-item @click="projects('/home')" index="/home">图标库</el-menu-item>
                <el-menu-item v-if="!username" @click="projects('/projects')">项目管理</el-menu-item>
                <el-menu-item v-else @click="projects('/projects')"  index="/projects">项目管理</el-menu-item>
                <el-menu-item @click="projects('/help')" index="/help">使用指南</el-menu-item>
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
            <div class="m-icons-project">
                <div class="title">
                    <span>加入项目</span>
                    <i class="el-icon-folder-add right-icon"></i>
                </div>
                <div class="project-list">
                    <ul>
                        <li>
                            <i class="el-icon-folder"></i>
                            <span>ops-ui</span>
                        </li>
                        <li>
                            <i class="el-icon-folder"></i>
                            <span>ops-test</span>
                        </li>
                    </ul>
                </div>
                <div class="icon-manage-bottom">
                    <el-button size="small" round>确定</el-button>
                    <el-button @click="drawer = false" size="small" round>取消</el-button>
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
import { logout } from '../services/index';
import { mapState } from 'vuex'

export default {
    name: "Navigation",
    data() {
        let icons = window.sessionStorage.getItem('ops-icons')
        icons = icons ? JSON.parse(icons) : []
        return {
            dialogVisible: false,
            searchName: "",
            activeIndex: '2',
            count: icons.length,
            icons: icons,
            drawer: false,
            direction: 'rtl',
        }
    },
    computed: {
        ...mapState({
            username: state => state.userInfo.userName
        })
    },
    methods: {
        querySearch(e){
            if(e === "click"){
                this.$emit('searchIcons',this.searchName)
                if(this.$route.path != '/home'){
                    this.$router.push({
                        name: 'home',
                        query: {
                            search: this.searchName
                        }
                    })
                }
            }else{
                let keyCode = window.event ? e.keyCode : e.which;
                if (keyCode == 13) {
                    this.$emit('searchIcons',this.searchName)
                    if(this.$route.path != '/home'){
                        this.$router.push({
                            name: 'home',
                            query: {
                                search: this.searchName
                            }
                        })
                    }
                }
            }
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
        projects(name){
            if(name === "/projects" && !this.username){
                this.dialogVisible = true
            }else{
                this.$router.push(name)
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
        height: 2.5rem;
        min-width: 2.125rem;
        margin: 0 .8rem 0 2.4rem;
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
}
.m-login{
    text-align: left;
}
.grid-content{
    font-size: 1.1rem;
    line-height: 60px;
    padding: 0px 20px;
    .shopping{
        cursor: pointer;
        padding-top: 16px;
        line-height: 20px;
    }
    .upload{
        cursor: pointer;
    }
    .login{
        margin-left: 10px;
    }
    .userName{
        padding-left: 5px;
        cursor: pointer;
        font-size: 14px;
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
            color: #ccc;
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
            background: #e6e9ec;
        }
    }
    .icon-manage-bottom{
        height: 89px;
        line-height: 80px;
        padding-left: 20px;
        // position: absolute;
        // bottom: 0;
        // left: 0;
        // width: 100%;
        background: #f3f3f3;
    }
}

</style>