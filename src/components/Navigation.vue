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
            <span class="shopping">
                 <el-badge :value="count" class="item">
                    <i id="appCart" @click="drawer = true" class="opsfont ops-03"></i>
                </el-badge>
            </span>
            <!-- <i id="appCart" class="opsfont ops-03"></i> -->
            <i class="el-icon-upload icon-upload"></i>
            <el-button class="login" @click="login" type="primary" size="mini" round>登录</el-button>
            <!-- <span class="userName">wiwi</span> -->
        </div>
         <div class="m-nav-search f-fr">
            <el-input size="mini" class="search" v-model="searchName" placeholder="输入图标关键词" @keyup.enter.prevent="querySearch($event)"  clearable>
              <template #append><el-button size="mini" icon="el-icon-search" @click="querySearch('click')"></el-button></template>
            </el-input>
        </div>
        <div class="grid-center f-fr">
            <el-menu router :default-active="$route.path" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-menu-item index="/">首页</el-menu-item>
                <el-menu-item index="/home">图标库</el-menu-item>
                <el-menu-item index="/projects">项目管理</el-menu-item>
                <el-menu-item index="/help">使用指南</el-menu-item>
            </el-menu>
        </div>
    </el-col>
</el-row>
    <el-drawer
        modal-class="m-drawer"
        v-model="drawer"
        :direction="direction"
        :before-close="handleClose" destroy-on-close>
    </el-drawer>
    <el-dialog
        custom-class="m-login"
        v-model="dialogVisible"
        width="400px"
        :before-close="handleClose">
        <login></login>
    </el-dialog>
</div>
</template>

<script>
import Login from './Login';

export default {
    name: "Navigation",
    data() {
        return {
            dialogVisible: false,
            searchName: "",
            activeIndex: '2',
            count:0,
            drawer: false,
            direction: 'rtl',
        }
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
        addIcons (type,id) {
            if(type === "add"){
                setTimeout(()=>{
                    this.count +=1;
                },810)
            }else{
                this.count--
            }
            console.log('id', id)
        },
        login(){
            this.dialogVisible = true
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
        padding-top: 16px;
        line-height: 20px;
    }
    .upload{
        cursor: pointer;
    }
    .login{
        margin-left: 10px;
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
    span{
        text-align: left;
        font-size: 14px;
    }
}
</style>