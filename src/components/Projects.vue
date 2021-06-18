<template>
<el-container style="height: 100%; border: 1px solid #eee">
  <el-container>
    <el-header style="text-align: right; font-size: 12px">
        <navigation></navigation>
    </el-header>
    <el-main class="home">
        <div class="m-content">
            <div class="m-row-user">
                <div class="user-logo">
                    <img src="https://sf6-ttcdn-tos.pstatp.com/img/user-avatar/693bcc26e2e1cb5cff0157182fd7f319~300x300.image" alt="">
                </div>
                <div class="user-info">
                    <div>Hi,wiwi</div>
                    <p>部门：效能研发部</p>
                </div>
            </div>
            <el-tabs class="padding-top-20" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="我的项目" name="1">我的项目</el-tab-pane>
                <el-tab-pane label="我的收藏" name="2">我的收藏</el-tab-pane>
                <el-tab-pane label="我的部门" name="3">我的部门</el-tab-pane>
            </el-tabs>
        </div>
   
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import Navigation from './Navigation';

  export default {
    data() {
      return {
        activeName: "1",
      }
    },
    mounted(){

    },
    methods: {

    },
    components: {
      Navigation
    }
  };
</script>


<style lang="less">
.el-card__body{
  padding: 0;
}

.icon {
  font-size: 36px;
}
</style>
<style lang="less" scoped>
.f-fr{
  float: right;
}
.home{
    padding-top: 100px;
}
.padding-top-20{
    padding-top: 20px;
}
.m-content{
    position: relative;
    min-height: calc(100vh - 64px);
    max-width: 1240px;
    padding: 0 20px;
    margin: auto;
}
.m-row-user{
    display: flex;
    align-items: center;
    color: #fff;
    z-index: 2;
    position: relative;
    max-width: 1200px;
    margin: 32px auto auto;
    .user-logo{
        margin-right: 25px;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;
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
            color: #999;
            font-size: 14px;
        }
    }
}
</style>
