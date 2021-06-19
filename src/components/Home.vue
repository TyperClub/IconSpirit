<template>
<el-container style="height: 100%; border: 1px solid #eee">
  <el-container>
    <el-header style="text-align: right; font-size: 12px">
        <navigation @searchIcons="searchIcons"></navigation>
        <div class="m-search center-search">
          <div class="item">
            <el-input size="medium" class="search" v-model="searchName" placeholder="输入图标关键词" @keyup.enter.prevent="querySearch($event)"  clearable>
              <template #append><el-button size="medium" icon="el-icon-search" @click="querySearch('click')"></el-button></template>
            </el-input>
            <span class="u-icons">{{pageInfo.total}} free icons</span>
            <div class="m-tab">
              <span>
              <i class="el-icon-s-grid grid"></i>
              </span>
              <span>
                <i class="el-icon-menu menu"></i>
              </span>
            </div>
          </div>
        </div>
    </el-header>
    <el-main class="home">
      <div>
        <el-row v-if="tableData.length > 0" class="u-row" :gutter="20">
          <el-col :span="4" v-for="(item,index) in tableData" :key="index" class="u-item">
              <el-card :shadow="item.status ? 'never' : 'hover'"  v-bind:class=" item.status ? 'selected' : '' " @mouseenter="showUI($event,item)" @mouseleave="hideUI($event,item)" @click="selectUI($event, item, index)">
                <div class="icon-base-view">
                  <div class="icon-base-view-left" v-html="item.content"></div>
                  <div class="icon-base-view-right">
                      <div class="ellipsis">{{item.CH_Name}}</div>
                      <div class="name">{{item.ENG_Name || 'other'}}</div>
                  </div>
                  <div class="icon-base-view-mask">
                    <i class="opsfont ops-3" @click="addToCart($event, item)"></i>
                  </div>
                  <!-- <span class="author"> <i class="el-icon-user user"></i> {{item.author || 'other'}}</span> -->
                </div>
              </el-card>
          </el-col>
        </el-row>
        <div class="m-tips" v-else>
          <div>
            <img src="https://sf3-dycdn-tos.pstatp.com/obj/eden-cn/bqaeh7vhobd/feedback.svg">
          </div>
          <div class="tips">
              <span>图标太少？点击上传图标</span> <i class="el-icon-upload upload"></i>
          </div>
        </div>
        <el-pagination
        class="m-page"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper"
        :page-sizes="[10, 30, 50,100]"
        :page-size="pageInfo.pagesize"
        :current-page="pageInfo.current"
        :total="pageInfo.total">
      </el-pagination>
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
              v-if="item" :style="{top:elTop+'px',left:elLeft+'px'}">
            <img :src="imgUrl?imgUrl:'https://cdn.qimai.cn/aso100/201710/06b463b971efff3da8c99764f5933750.png'" alt="">
        </div>
        </transition>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import {iconList} from '../services/index';
import Navigation from './Navigation';

  export default {
    data() {
      return {
        activeIndex: '2',
        searchName: this.$route.query.search,
        tableData: [],
        showMoveDot: [],
        imgUrl:'',
        elLeft: 0, //当前点击购物车按钮在网页中的绝对top值
        elTop: 0, //当前点击购物车按钮在网页中的绝对left值
        pageInfo: {
          pagesize: 42,
          current: 1,
          total: 0
        }
      }
    },
    mounted(){
      this.getIconsList(this.searchName)
    },
    methods: {
      showUI(event){
        event.target.querySelector(".icon-base-view-mask").style.display="block"
      },
      hideUI(event){
        event.target.querySelector(".icon-base-view-mask").style.display="none"
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
          const xDist = badgePosition.left - this.elLeft + 10;
          const yDist = badgePosition.top - this.elTop;
          el.style.transform = `translate(${xDist}px, ${yDist}px)`;
          el.style.transition = 'all 0.8s cubic-bezier(0.12,0.78,0.53,0.92)';
          this.showMoveDot = this.showMoveDot.map(() => false);
          done()
      },
      addToCart(event, row){
        console.log(111, event)
        this.showMoveDot = [...this.showMoveDot, true];
        //显示图片
        this.imgUrl = row.imgUrl;
        this.elLeft = event.target.getBoundingClientRect().left;
        this.elTop = event.target.getBoundingClientRect().top;
      },
      selectUI(item, index){
        // item.status = !item.status
        this.tableData[index] = item
      },
      searchIcons(val){
        this.searchName = val
        this.pageInfo.current = 1
        this.getIconsList(this.searchName)
      },
      getIconsList(name){
        let parames = {
          "pageNum": this.pageInfo.current,
          "pageSize": this.pageInfo.pagesize
        }
        if (name) parames.name = name
        iconList(parames).then(res => {
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
      querySearch(e){
        this.pageInfo.current = 1
        if(e === "click"){
           this.getIconsList(this.searchName)
        }else{
          let keyCode = window.event ? e.keyCode : e.which;
          if (keyCode == 13) {
            this.getIconsList(this.searchName)
          }
        }
      },
      handleCurrentChange(val){
        this.pageInfo.current = val
        this.getIconsList()
      }
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
.u-icons{
  margin-left: 20px;
  font-size: 18px;
  color: #000;
  font-weight: bold;
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
    .item{
      flex: 1;
    }
    .search{
      width: 500px;
      margin: 0 auto;
    }
    .m-tab{
      display: inline-block;
      margin-left: 20px;
      span{
        display: inline-block;
        border-radius: 4px;
        height: 34px;
        line-height: 34px;
        width: 34px;
        text-align: center;
        border: 1px solid #ccc;
        font-size: 16px;
        cursor: pointer;
      }
      span:not(:last-child){
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      span:not(:first-child){
        margin-left: -1px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
      i{
        position: relative;
        top: 1px;
      }
    }
  }

  .el-aside {
    color: #333;
  }
  .u-item{
    margin-top: 20px;
  }
  .m-tips{
    color: #999;
    text-align: center;
    .tips{
      font-size: 14px;
    }
    span{
      vertical-align: middle;
    }
    .upload{
      cursor: pointer;
      font-size: 28px;
      vertical-align: middle;
      color: #444;
    }
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
   .icon-base-view-mask{
      display: none;
      i{
        font-size: 20px;
      }
      &:hover{
        display: block;
      }
    }
  .icon-base-view{
    &:hover{
      .icon-base-view-mask{
        display: block;
      }
    }
    display: flex;
    position: relative;
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
  .m-page{
    margin-top: 20px;
    text-align: right;
  }

  .move_dot {
        width: 50px;
        height: 50px;
        /*border-radius: 50%;*/
        /*background-color: #00b38a;*/
        position: fixed;
        z-index: 99;
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
</style>
