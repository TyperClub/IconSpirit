<template>
    <el-container style="height: 100%;">
        <el-header style="text-align: right; font-size: 12px">
            <navigation class="m-home-nav" ref="navigation" @deleteSelectIcon="deleteSelectIcon"></navigation>
        </el-header>
    <div class="home">
           <section id="home" class="w3l-banner py-5">
                <div class="banner-image">
                </div>
                <div class="banner-content">
                    <div class="container">
                        <el-row>
                            <el-col :span="10">
                                <div class="m-box">
                                    <h3 class="title">156 free icons</h3>
                                    <p class="tips">这里有你需要的图标，也有属于你的风格，让工作变得更轻松</p>
                                    <div class="u-search">
                                        <el-input size="medium" class="search" v-model="name" placeholder="输入图标关键词" @keyup.enter.prevent="querySearch($event)"  clearable>
                                            <template #append><el-button size="medium" icon="el-icon-search" @click="querySearch('click')"></el-button></template>
                                        </el-input>
                                    </div>
                                    <div class="gonggao">
                                        <span><i class="opsfont ops-gonggao"></i> 杨韦韦，刚创建了 aaaa 项目</span>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <img class="img-fluid" src="../assets/bann1.png" alt=" ">
                            </el-col>
                        </el-row>
                    </div>
                </div>
        </section>
    </div>
    </el-container>
</template>

<script>
import Navigation from './Navigation';
import $ from 'jquery'

export default {
    data(){
        return {
            name: ""
        }
    },
    mounted(){
        this.animate();
    },
    methods: {
        animate(){
            var lFollowX = 0,
            lFollowY = 0,
            x = 0,
            y = 0,
            friction = 1 / 30;

            function animate() {
                x += (lFollowX - x) * friction;
                y += (lFollowY - y) * friction;

                let translate = 'translate(' + x + 'px, ' + y + 'px) scale(1.1)';
                $('.banner-image').css({
                    '-webit-transform': translate,
                    '-moz-transform': translate,
                    'transform': translate
                });
                window.requestAnimationFrame(animate);
            }

            $(window).on('mousemove click', function (e) {
                var lMouseX = Math.max(-100, Math.min(100, $(window).width() / 2 - e.clientX));
                var lMouseY = Math.max(-100, Math.min(100, $(window).height() / 2 - e.clientY));
                lFollowX = (20 * lMouseX) / 100; // 100 : 12 = lMouxeX : lFollow
                lFollowY = (10 * lMouseY) / 100;
            });
            animate();
        },
        querySearch(){
            
        }
    },
    components:{
        Navigation
    }
}
</script>

<style lang="less">
.m-home-nav .m-header {
    box-shadow: none !important;
}
</style>

<style lang="less" scoped>

.m-logo{
    padding-top: 200px;
}

/*-- banner --*/
.w3l-banner {
  padding-top: 145px;
  position: relative;
  overflow: hidden;
  min-height: calc(100vh - 80px);
}

.w3l-banner .banner-image {
  position: absolute;
  overflow: hidden;
  background-image: url(../assets/banner.png);
  background-size: cover;
  background-position: center;
  top: 0;
  width: 100%;
  height: 100%;
  transform: scale(1.1);
  min-height: calc(100vh - 80px);
}

.w3l-banner .banner-content {
    position: relative;
    z-index: 1;
  display: grid;
  align-items: center;
  min-height: calc(100vh - 80px);
}

/* .w3l-banner {
  background: url(../images/banner.png) no-repeat center;
  background-size: cover;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  -ms-background-size: cover;
  /* min-height: 800px; */
/* min-height: 100vh;
  display: flex;
  align-items: center;
} */

.w3l-banner h3 {
  font-size: 38px;
  line-height: 42px;
}

.w3l-banner h3 span {
  font-size: 54px;
  line-height: 64px;
  font-weight: bold;
}

@media (max-width: 1200px) {}

@media (max-width:991px) {
  .w3l-banner h3 {
    font-size: 24px;
    line-height: 34px;
  }

  .w3l-banner h3 span {
    font-size: 40px;
    line-height: 50px;
  }
}

@media (max-width: 355px) {
  .w3l-banner h3 {
    font-size: 22px;
    line-height: 32px;
  }

  .w3l-banner h3 span {
    font-size: 38px;
    line-height: 48px;
  }
}

@media (max-width: 330px) {
  .w3l-banner h3 {
    font-size: 20px;
    line-height: 30px;
  }

  .w3l-banner h3 span {
    font-size: 35px;
    line-height: 45px;
  }
}

  .container {
    min-width: 992px !important;
  }

  /*-- container --*/
.container {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}

@media (min-width: 992px) {
  .container {
    max-width: 960px;
    margin-right: auto;
    margin-left: auto;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
    margin-right: auto;
    margin-left: auto;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }
}

.m-box{
    .u-search{
        margin: 20px 0;
    }
    .tips{
        font-size: 16px;
        line-height: 26px;
        padding: 10px 0 0;
    }
    .gonggao{
        font-size: 14px;
    }
}

</style>