<template>
    <el-container style="height: 100%;">
         <el-header style="text-align: right; font-size: 12px">
            <navigation ref="navigation" @deleteSelectIcon="deleteSelectIcon" @addIconsShopping="addIconsShopping" @openDrawer="openDrawer"></navigation>
        </el-header>
         <div class="home">
            <div class="m-content" v-loading="loading">
                <div class="m-user">
                    <div class="m-row-user">
                        <div class="u-nav">
                            <span class="main-nav" @click="goBack"> <i class="opsfont ops-report"></i> <b>图标库</b></span>
                            <i class="el-icon-arrow-right arrow-right"></i>
                            <span> {{tableData.length && tableData[0].gurop || ""}}</span>
                        </div>
                        <div class="m-row-user-info">
                            <div class="user-logo">
                                <el-avatar class="logo" :size="100" :src="circleUrl"></el-avatar>
                            </div>
                            <div class="user-info">
                                <div>{{tableData.length && tableData[0].gurop || "" }}</div>
                                <p class="f-size-14">{{tableData.length}} icons</p>
                                <p class="f-size-14">{{tableData.length && tableData[0].author}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="m-icons">
                    <el-row v-if="tableData.length > 0" class="u-row" :gutter="20">
                        <el-col :xs="8" :sm="6" :md="6" :lg="4" v-for="(item,index) in tableData" :key="index" class="u-item">
                            <el-card :shadow="item.status ? 'never' : 'hover'"  v-bind:class=" item.status ? 'selected' : '' "  @click="selectUI($event, item, index)">
                                <div class="icon-base-view">
                                <div class="icon-base-view-left" v-html="item.content"></div>
                                <div class="icon-base-view-right">
                                    <div class="ellipsis">{{item.CH_Name}}</div>
                                    <div class="name">{{item.ENG_Name || 'other'}}</div>
                                </div>
                                <div class="icon-base-view-mask">
                                    <i :class="item.status ? 'ops-03f': 'ops-03'" class="opsfont" @click="addToCart($event, item)" title="添加到购物车"></i>
                                    <i class="opsfont ops-xiazai"  @click="downIcon(item)" title="下载"></i>
                                </div>
                                <!-- <span class="author"> <i class="el-icon-user user"></i> {{item.author || 'other'}}</span> -->
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
         <!-- 小球 -->
        <transition appear
            @before-appear="beforeEnter"
            @enter="enter"
            @after-appear='afterEnter'
            v-for="(item,index) in showMoveDot"
            :key="index.id">
            <div class="move_dot"
                  ref="ball"
                  v-if="item" :style="{top:elTop+'px',left:elLeft+'px'}" v-html="imgUrl">
            </div>
        </transition>
        <el-backtop></el-backtop>
    </el-container>
</template>

<script>
import Navigation from './Navigation';
import { getCollectionIcons } from "../services/index"

export default {
    data(){
        return {
            tableData: [],
            circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            loading: false,
            showMoveDot: [],
            imgUrl:'',
            elLeft: 0, //当前点击购物车按钮在网页中的绝对top值
            elTop: 0, //当前点击购物车按钮在网页中的绝对left值
            count:0,
        }
    },
    mounted(){
        this.getCollectionIcons()
    },
    methods: {
        getCollectionIcons(){
            this.loading = true
            getCollectionIcons({
                id: this.$route.query.collectionId
            }).then(res => {
                let data = res.data
                let icons = window.sessionStorage.getItem('ops-icons')
                icons = icons ? JSON.parse(icons) : []
                data.forEach(item => {
                    item.status = false
                    icons.forEach(obj =>{
                    if(obj.id  ==  item.id){
                        item.status  =  true
                    }
                    })
                })
                this.loading = false
                this.tableData = data
            }).catch(err => {
                this.loading = false
                this.$message.error(err.error)
            })
        },
         addToCart(event, item){
            let type = 'remove'
            if(!item.status){
            type = 'add'
            this.showMoveDot = [...this.showMoveDot, true];
            // //显示图片
            this.imgUrl = item.content;
            this.elLeft = event.target.getBoundingClientRect().left + 10;
            this.elTop = event.target.getBoundingClientRect().top + 30;
            }
            item.status = !item.status
            this.$refs.navigation.addIcons(type, item)
        },
        selectUI(item, index){
            // item.status = !item.status
            this.tableData[index] = item
        },
        downIcon(item){
            let dataURL = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(item.content))); //给图片对象写入base64编码的svg流
            let dl = document.createElement("a");
            let fileName = item.ENG_Name
            dl.style.display = 'none';
            document.body.appendChild(dl); // This line makes it work in Firefox.
            dl.setAttribute("href", dataURL);
            dl.setAttribute("download", `${fileName}.svg`);
            dl.click();
            // 然后移除
            document.body.removeChild(dl);
        },
        beforeEnter(el) {
            // 设置transform值
            el.style.opacity = 0;
            el.style.transform = 'translate(0, 0)'
      },
      afterEnter(el) {
          // 设置透明度
          el.style.opacity = 1;
          setTimeout(()=>{
              this.count +=1;
          },810)
      },
      enter(el, done) {
          el.offsetWidth;
          // 获取徽标在页面中的位置
          let badgePosition = document.getElementById('appCart').getBoundingClientRect();
          const xDist = badgePosition.left - this.elLeft - 10;
          const yDist = badgePosition.top - this.elTop;
          el.style.transform = `translate(${xDist}px, ${yDist}px)`;
          el.style.transition = 'all 0.8s cubic-bezier(0.12,0.78,0.53,0.92)';
          this.showMoveDot = this.showMoveDot.map(() => false);
          done()
      },
      deleteSelectIcon(type, item){
        this.tableData.forEach(obj =>{
          if(type == "all"){
            obj.status = false
          }else{
            if(obj.id == item.id){
              obj.status = false
            }
          }
        })
      },
      goBack(){
          this.$router.push({
            name: 'search',
            query: {
                type: "2"
            }
        })
      }
    },
    components: {
        Navigation
    }
}
</script>

<style lang="less">
.el-card__body{
  padding: 0;
}
</style>

<style lang="less" scoped>
.f-fr{
  float: right;
}
.f-size-14{
    font-size: 14px;
}
.m-user{
    position: relative;
    background: #f9f9f9;
    padding: 90px 0 30px;
}

.u-nav{
    font-size: 14px;
    .ops-report{
        color: #666;
        font-size: 14px;
    }
    .arrow-right{
        font-size: 14px;
        padding: 0 6px;
    }
    .main-nav{
        top: -1px;
        position: relative;
        cursor: pointer;
        *{
            vertical-align: middle;
        }
    }
}

.m-row-user{
    z-index: 2;
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    .m-row-user-info{
        padding-top: 30px;
        display: flex;
        align-items: center;
    }
    .user-logo{
        margin-right: 25px;
        .logo:hover{
            transform: rotate(666turn);
            transition-delay: 1s;
            transition-property: all;
            transition-duration: 59s;
            transition-timing-function: cubic-bezier(.34,0,.84,1);
        }
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
            padding-top: 10px;
            color: #999;
            font-size: 14px;
        }
    }
}

.m-icons{
    padding: 20px 20px 50px 20px;
    max-width: 1300px;
    min-height: 200px;
    margin: 0 auto;
}

 .icon-base-view-mask{
     position: absolute;
     right: 15px;
     color: #fff;
     opacity: 0;
      i{
        margin-left: 5px;
        font-size: 20px;
        line-height: 22px;
        text-align: center;
        background: rgba(25, 103, 210, 0.05);
        border-radius: 50%;
        padding: 8px;
        font-weight: bold;
        color: #409EFF;
        &:hover{
          color: #0366d6;
        }
      }
      &:hover{
        display: block;
      }
    }
  .icon-base-view{
    &:hover{
      .icon-base-view-right, .icon-base-view-left{
        opacity: 0.3;
        transition: opacity 0.3s;
      }
      .icon-base-view-mask{
        opacity: 1;
        transition: opacity 0.3s;
      }
    }
    display: flex;
    position: relative;
    align-items: center;
    background: var(--card-bg);
    cursor: pointer;
    .icon-base-view-left{
      max-width: 64px;
      height: 64px;
      padding: 0 10px;
      line-height: 64px;
      text-align: center;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-base-view-right{
      min-width: 140px;
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
    .author{
        position: absolute;
        right: 10px;
        bottom: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
        line-height: 20px;
        color: #999;
      }
   
  }
.selected{
    border-color: #409EFF;
}
.u-item{
    margin-top: 20px;
}


  .move_dot {
        width: 50px;
        height: 50px;
        /*border-radius: 50%;*/
        /*background-color: #00b38a;*/
        position: fixed;
        z-index: 999999;
        img {
            animation: 0.8s move ease-in-out;
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }
    }
    @keyframes move {
        0% {
            transform: scale(1);
        }
        25% {
            transform: scale(0.8);
        }
        50% {
            transform: scale(0.6);
        }
        75% {
            transform: scale(0.4);
        }
        100% {
            transform: scale(0.2);
        }
    }
    @-moz-keyframes move {
        0% {
            transform: scale(1);
        }
        25% {
            transform: scale(0.8);
        }
        50% {
            transform: scale(0.6);
        }
        75% {
            transform: scale(0.4);
        }
        100% {
            transform: scale(0.2);
        }
    }
    @-webkit-keyframes move {
        0% {
            transform: scale(1);
        }
        25% {
            transform: scale(0.8);
        }
        50% {
            transform: scale(0.6);
        }
        75% {
            transform: scale(0.4);
        }
        100% {
            transform: scale(0.2);
        }
    }
    @-o-keyframes move {
        0% {
            transform: scale(1);
        }
        25% {
            transform: scale(0.8);
        }
        50% {
            transform: scale(0.6);
        }
        75% {
            transform: scale(0.4);
        }
        100% {
            transform: scale(0.2);
        }
    }

@media screen and (max-width: 1400px) {
    .m-search .search{
      width: 400px;
    }
}

@media screen and (max-width: 1300px) {
    .m-color-type{
      display: none;
    }
}
</style>