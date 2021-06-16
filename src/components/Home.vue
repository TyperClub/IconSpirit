<template>
<el-container style="height: 100%; border: 1px solid #eee">
  <el-container>
    <el-header style="text-align: right; font-size: 12px">
        <el-row style="wdith:100%">
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
                    <i class="el-icon-upload upload"></i>
                    <span class="userName">wiwi</span>
                </div>
                <div class="grid-center f-fr">
                    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                        <el-menu-item index="1">首页</el-menu-item>
                        <el-menu-item index="2">图标库</el-menu-item>
                        <el-menu-item index="3">项目管理</el-menu-item>
                        <el-menu-item index="4">使用指南</el-menu-item>
                    </el-menu>
                </div>
            </el-col>
        </el-row>
        <div class="m-search center-search">
          <el-input size="medium" class="search" v-model="input" placeholder="输入图标关键词" clearable>
            <template #append><el-button size="medium" icon="el-icon-search"></el-button></template>
          </el-input>
        </div>
    </el-header>
    <el-main class="home">
      <div>
        <el-row class="u-row" :gutter="20" v-for="i in 6" :key="i">
          <el-col :span="4" v-for="i2 in 6" :key="i2">
              <el-card shadow="hover"  v-bind:class=" i == 1 & i2 == 1 ? 'selected' : '' " @mouseenter="showUI(i)" @mouseleave="hideUI(i)" @click="selectUI(i)">
                <div class="icon-base-view">
                  <div class="icon-base-view-left">
                    <accept-email theme="two-tone" size="24" :fill="['#333' ,'#2F88FF']"/>
                    <!-- <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="48" height="48" fill="white" fill-opacity="0.01"/>
<circle cx="24" cy="24" r="5" fill="#2F88FF" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.5 44C16.5964 44 11 38.4036 11 31.5C11 24.5964 16.5964 19 23.5 19" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M44 23.5C44 30.4036 38.4036 36 31.5 36C24.5964 36 19 30.4036 19 23.5" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.5 29C30.4036 29 36 23.4036 36 16.5C36 9.59644 30.4036 4 23.5 4" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M29 23.5C29 16.5964 23.4036 11 16.5 11C9.59644 11 4 16.5964 4 23.5" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg> -->
                  </div>
                  <div class="icon-base-view-right">
                      <div class="ellipsis">接受邮件</div>
                      <div class="name">accept-email</div>
                  </div>
                </div>
              </el-card>
        </el-col>
        </el-row>
        <el-pagination
        class="m-page"
        background
        layout="prev, pager, next"
        :total="1000">
      </el-pagination>
      </div>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import {AcceptEmail} from '@icon-park/vue-next';

  export default {
    data() {
      return {
        activeIndex: '2',
        input: "",
        tableData: [{
          id: 0,
          gurop: "测试",
          CH_Name: "接受邮件",
          ENG_Name: "accept-email",
          content: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="48" height="48" fill="white" fill-opacity="0.01"/>
<circle cx="24" cy="24" r="5" fill="#2F88FF" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.5 44C16.5964 44 11 38.4036 11 31.5C11 24.5964 16.5964 19 23.5 19" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M44 23.5C44 30.4036 38.4036 36 31.5 36C24.5964 36 19 30.4036 19 23.5" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.5 29C30.4036 29 36 23.4036 36 16.5C36 9.59644 30.4036 4 23.5 4" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M29 23.5C29 16.5964 23.4036 11 16.5 11C9.59644 11 4 16.5964 4 23.5" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
        }]
      }
    },
    components: {
        AcceptEmail
    },
    methods: {
      showUI(){
        // console.log(1111)
      },
      hideUI(){
        // console.log(222)
      },
      selectUI(){
        
      }
    }
  };
</script>


<style lang="less">
.el-card__body{
  padding: 0;
}
.center-search {
  .el-input__inner {
    border-radius: 15px 0 0 15px;
    
    background-color: #f5f7fa;
  }
  .el-input-group__append {
    border-radius: 0 15px 15px 0;
    .el-button {
      color: #d90029;
    }
  }
}
</style>
<style lang="less" scoped>
.f-fr{
  float: right;
}
.el-header {
    padding: 0;
    position: fixed;
    left: 0;
    background-color: #fff;
    box-sizing: border-box;
    z-index: 20;
    top: 0;
    right: 0;
    box-shadow: 0 2px 8px #f0f1f2;
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
  }
  .home{
      padding-top: 134px;
  }
  .m-search{
    display: flex;
    border-bottom: 1px solid #f0f0f0;
    position: -webkit-sticky;
    position: sticky;
    top: 64px;
    z-index: 100;
    background: #fff;
    padding: 15px 0;
    text-align: center;
    .search{
      width: 500px;
      margin: 0 auto;
    }
  }

  .el-aside {
    color: #333;
  }
  .u-row{
    margin-top: 20px;
  }
  .icon-base{
      background: #fff;
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      box-sizing: border-box;
      cursor: pointer;
      overflow: hidden;
  }
  .selected{
    border-color: #409EFF;
  }
  .icon-base-view{
    display: flex;
    align-items: center;
    background: var(--card-bg);
    cursor: pointer;
    .icon-base-view-left{
      width: 64px;
      height: 64px;
      line-height: 64px;
      text-align: center;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-base-view-right{
      width: 160px;
      height: 42px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      .icon-base-view-text{
        overflow: hidden;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
        line-height: 20px;
        color: #999;
      }
       .ellipsis{
            font-size: 0.8rem;
            font-weight: 500;
            color: #2a2a2a;
            position: relative;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .name{
            overflow: hidden;
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 12px;
            line-height: 20px;
            color: #999;
        }
    }
  }
  .m-page{
    margin-top: 20px;
    text-align: right;
  }
</style>
