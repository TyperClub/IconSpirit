<template>
    <el-container style="height: 100%;">
        <el-header class="m-el-header" style="text-align: right; font-size: 12px">
            <navigation class="m-home-nav" ref="navigation" @deleteSelectIcon="deleteSelectIcon" :logoStatus="true"></navigation>
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
                                    <h3 class="title"><vue3-autocounter ref='counter' :startAmount='0' :endAmount='total' :duration='1' separator=',' :autoinit='true'/> free icons</h3>
                                    <p class="tips">这里有你需要的图标，也有属于你的风格，让工作变得更轻松</p>
                                    <div class="u-search">
                                        <el-input class="search" suffix-icon="el-icon-search" v-model="searchName" placeholder="请输入图标关键词" @keyup.enter.prevent="querySearch($event)"  clearable></el-input>
                                    </div>
                                    <div class="gonggao">
                                        <span><i class="opsfont ops-gonggao"></i> {{tips[num]}}</span>
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
import {iconList} from '../services/index';
import $ from 'jquery'

export default {
    data(){
        return {
            searchName: "",
            interval: null,
            total: 0,
            num: 0,
            tips: ['用户 杨韦韦 刚发起了 aaaa 项目', '用户 admin 刚发起了 bbb 项目']
        }
    },
    mounted(){
        this.animate();
        this.startTips()
        this.getIconsList()
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
        querySearch(e){
            if(e === "click"){
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
        getIconsList(){
          iconList({
            "pageNum": 1,
            "pageSize": 1
          }).then(res => {
            this.total = res.total
          }).catch(err => {
            console.log('错误', err)
          })
       },
        startTips(){
          clearInterval(this.interval)
          this.interval = setInterval(() =>{
            if(this.tips.length - 1 <= this.num){
              this.num = 0
            }else{
              this.num ++
            }
          }, 3000)
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
.m-el-header{
  background: none;
}
.m-logo{
    padding-top: 200px;
}

/*-- banner --*/
.w3l-banner {
  padding-top: 145px;
  position: relative;
  overflow: hidden;
  min-height: calc(100vh - 145px);
}

.w3l-banner .banner-image {
  position: absolute;
  overflow: hidden;
  background-image: url(../assets/banner_1.png);
  background-size: cover;
  background-position: center;
  top: 0;
  width: 100%;
  height: 100%;
  transform: scale(1.1);
  min-height: calc(100vh - 145px);
}

.w3l-banner .banner-content {
    position: relative;
    z-index: 1;
  display: grid;
  align-items: center;
  min-height: calc(100vh - 145px);
}

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

.img-fluid{
    width: 580px;
}

</style>