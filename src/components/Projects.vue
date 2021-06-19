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
                    <p class="f-size-14">部门：效能研发部</p>
                </div>
            </div>
            <el-tabs class="padding-top-20" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="我的项目" name="1">
                    <el-row class="m-project-box">
                        <div class="m-project">
                            <div class="u-project">
                                <div><i class="el-icon-menu menu"></i><span class="project-title">我发起的项目</span></div>
                                <div class="project-list">
                                    <div class="item current"><span>ops-ui</span></div>
                                    <div class="item"><span>测试项目</span></div>
                                </div>
                            </div>
                            <div class="u-project">
                                <div><i class="el-icon-menu menu"></i><span class="project-title">我参入的项目</span></div>
                                <div class="project-list">
                                    <div class="item"><span>ops-ui</span></div>
                                    <div class="item"><span>测试项目</span></div>
                                </div>
                            </div>
                        </div>
                         <el-col>
                         </el-col>
                    </el-row>
                </el-tab-pane>
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
.icon {
  font-size: 36px;
}
</style>
<style lang="less" scoped>
.f-fr{
  float: right;
}
.f-size-14{
    font-size: 14px;
}
.home{
    padding-top: 70px;
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
.m-project-box{
    padding-top: 10px;
}
.m-project{
    width: 150px;
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
</style>
