<template>
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
            <!-- <el-badge :value="12" class="item">
                <i id="appCart" class="opsfont ops-3"></i>
            </el-badge> -->
            <i id="appCart" class="opsfont ops-3"></i>
            <i class="el-icon-upload upload"></i>
            <span class="userName">wiwi</span>
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
</template>

<script>

export default {
    name: "Navigation",
    data() {
        return {
            searchName: "",
            activeIndex: '2',
            count:0,
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
        }
    }
}
</script>

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
.grid-content{
    font-size: 1.1rem;
    line-height: 60px;
    padding: 0 20px;
    .upload{
        cursor: pointer;
    }
    .userName{
        padding-left: 10px;
    }
}
.m-nav-search{
    line-height:  60px;
    .search{
        width: 200px;
    }
}
.ops-3{
    cursor: pointer;
    padding-right: 8px;
    font-size: 16px;
}
</style>