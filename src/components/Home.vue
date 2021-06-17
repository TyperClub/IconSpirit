<template>
<el-container style="height: 100%; border: 1px solid #eee">
  <el-container>
    <el-header style="text-align: right; font-size: 12px">
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
        <el-row class="u-row" :gutter="20">
          <el-col :span="4" v-for="(item,index) in tableData" :key="index" class="u-item">
              <el-card :shadow="item.status ? 'never' : 'hover'"  v-bind:class=" item.status ? 'selected' : '' " @mouseenter="showUI(item)" @mouseleave="hideUI(item)" @click="selectUI(item, index)">
                <div class="icon-base-view">
                  <div class="icon-base-view-left" v-html="item.content"></div>
                  <div class="icon-base-view-right">
                      <div class="ellipsis">{{item.CH_Name}}</div>
                      <div class="name">{{item.ENG_Name || 'other'}}</div>
                  </div>
                </div>
              </el-card>
        </el-col>
        </el-row>
        <el-pagination
        class="m-page"
        background
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :page-size="pageInfo.pagesize"
        :current-page="pageInfo.current"
        :total="pageInfo.total">
      </el-pagination>
      </div>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import {iconList} from '../services/index';

  export default {
    data() {

      return {
        activeIndex: '2',
        input: "",
        tableData: [],
        pageInfo: {
          pagesize: 42,
          current: 1,
          total: 0
        }
      }
    },
    mounted(){
      this.getIconsList()
    },
    methods: {
      showUI(){
        // console.log(1111)
      },
      hideUI(){
        // console.log(222)
      },
      selectUI(item, index){
        item.status = !item.status
        this.tableData[index] = item
      },
      getIconsList(){
        iconList({
          "pageNum": this.pageInfo.current,
          "pageSize": this.pageInfo.pagesize
        }).then(res => {
          let data = res.data
          data.forEach(item => {
            item.status = false
          })
          this.tableData = data
          this.pageInfo.current = res.pageNum
          this.pageInfo.total = res.total
        }).catch(err => {
          console.log('错误', err)
        })
      },
      handleCurrentChange(val){
        this.pageInfo.current = val
        this.getIconsList()
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
.icon {
  font-size: 36px;
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
  .u-item{
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
