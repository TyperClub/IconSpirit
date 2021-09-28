<template>
  <el-container>
    <el-header class="m-header-search" style="text-align: right; font-size: 12px">
        <navigation class="m-search-header" ref="navigation" @searchIcons="searchIcons" @deleteSelectIcon="deleteSelectIcon"></navigation>
        <div class="m-search center-search">
          <div class="item">
            <el-input size="medium" class="search" v-model="searchName" :placeholder="boxType === '1' ? '请输入图标关键词' : '请输入图标库关键词'" @keyup.enter.prevent="querySearch($event)"  clearable>
              <template #append><el-button size="medium" icon="el-icon-search" @click="querySearch('click')"></el-button></template>
            </el-input>
            <span class="u-icons">{{( boxType === '1' ? pageInfo.total + '' : iconsCollectionPageInfo.total + '').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g,'$1,')}} {{boxType === '1' ? 'free icons' : 'free library'}}</span>
            <div class="m-tab">
               <el-radio-group size="mini" v-model="boxType" @change="changeBoxType">
                    <el-radio-button label="1"><i class="el-icon-s-grid grid"></i></el-radio-button>
                    <el-radio-button label="2"> <i class="el-icon-menu menu"></i></el-radio-button>
              </el-radio-group>
            </div>
            <div class="m-color-type">
              <el-radio-group size="mini" v-model="colorType" @change="changeColorType">
                    <el-radio-button label="1">所有</el-radio-button>
                    <el-radio-button label="4">官网图标</el-radio-button>
                    <el-radio-button label="2">单色图标</el-radio-button>
                    <el-radio-button label="3">多色图标</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </div>
    </el-header>
    <el-main class="home" v-loading="loading">
      <div class="m-home-box">
        <div v-if="boxType === '1'">
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
            <div class="m-tips" v-else>
              <div>
                <img src="https://sf3-dycdn-tos.pstatp.com/obj/eden-cn/bqaeh7vhobd/feedback.svg">
              </div>
              <div class="tips">
                  <span>图标太少？点击上传图标</span> <i class="el-icon-upload upload" @click="upload"></i>
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
        <div class="m-home-box-2" v-if="boxType === '2'" v-loading="loading1">
            <div v-if="iconsCollection.length > 0">
              <el-card class="m-block-collection" shadow="hover" v-for="(item, index) in iconsCollection" :key="index">
                <div class="block-collection">
                  <ul class="clearfix block-collection-icons" @click="openCollection(item)">
                    <li class="icon-wrap" v-for="(icon, index) in item.icons" :key="index">
                      <div v-html="icon.content"></div>
                    </li>
                  </ul>
                  <div class="collection-info mt10">
                    <span class="f-fl"><i class="opsfont ops-log"></i> {{item.gurop}}</span>
                    <span class="f-fr">icons <b>{{item.count}}</b></span>
                  </div>
                  <div class="collection-info mt5">
                    <span class="f-fl"><el-avatar class="userImg" :size="24" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar> {{item.author}}</span>
                    <span class="f-fr"><i class="el-icon-time"></i> {{item.createTime}}</span>
                  </div>
                </div>
              </el-card>
            </div>
            <div class="m-tips" v-else>
              <div>
                <img src="https://sf3-dycdn-tos.pstatp.com/obj/eden-cn/bqaeh7vhobd/feedback.svg">
              </div>
              <div class="tips">
                   <span>图标库太少？赶紧去创建图标库</span>
              </div>
            </div>
            <el-pagination
              class="m-page"
              @current-change="handleCurrentChange2"
              layout="total, prev, pager, next, jumper"
              :page-sizes="[10, 30, 50,100]"
              :page-size="iconsCollectionPageInfo.pagesize"
              :current-page="iconsCollectionPageInfo.current"
              :total="iconsCollectionPageInfo.total">
            </el-pagination>
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
    </el-main>
  </el-container>
</template>

<script>
import {iconList} from '../services/index';
import Navigation from './Navigation';
import { mapState } from 'vuex'
import Moment from 'moment'
import $ from 'jquery'

  export default {
    data() {
      let pagesize = 42
      if(document.body.clientHeight >= 900){
        pagesize = 48
      }
      if(document.body.clientHeight >= 1000){
        pagesize = 60
      }
      if(document.body.clientHeight >= 1100){
        pagesize = 66
      }
      let boxType = this.$route.query.type ? this.$route.query.type : "1"
      return {
        loading: false,
        loading1: false,
        activeIndex: '2',
        colorType: "1",
        boxType,
        searchName: this.$route.query.search,
        tableData: [],
        iconsCollection: [],
        iconsCollectionPageInfo: {
          pagesize: 9,
          current: 1,
          total: 0
        },
        showMoveDot: [],
        imgUrl:'',
        elLeft: 0, //当前点击购物车按钮在网页中的绝对top值
        elTop: 0, //当前点击购物车按钮在网页中的绝对left值
        count:0,
        pageInfo: {
          pagesize,
          current: 1,
          total: 0
        }
      }
    },
    computed: {
        ...mapState({
            username: state => state.userInfo.userName
        })
    },
    mounted(){
      this.getIconsList(this.searchName)
      this.getIconsList2()
    },
    methods: {
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
      searchIcons(val){
        this.searchName = val
        this.pageInfo.current = 1
        this.getIconsList(this.searchName)
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
      changeColorType(){
        if(this.boxType === "1"){
          this.pageInfo.current = 1
          this.getIconsList(this.searchName)
        }else if(this.boxType === "2"){
          this.iconsCollectionPageInfo.current = 1
          this.getIconsList2()
        }
      },
      changeBoxType(){
        if(this.searchName){
          this.searchName = ""
          this.pageInfo.current = 1
          this.getIconsList(this.searchName)
          this.iconsCollectionPageInfo.current = 1
          this.getIconsList2()
          return
        }
        if(this.pageInfo.current != 1){
          this.searchName = ""
          this.pageInfo.current = 1
          this.getIconsList(this.searchName)
        }
        if(this.iconsCollectionPageInfo.current != 1){
          this.searchName = ""
          this.iconsCollectionPageInfo.current = 1
          this.getIconsList2()
        }
        this.$router.push({
            name: 'search',
            query: {
                type: this.boxType
            }
        })
      },
      handleCurrentChange2(val){
        this.iconsCollectionPageInfo.current = val
        this.getIconsList2()
      },
      getIconsList2(){
        this.loading1 = true
        let parames = {
          "pageNum": this.iconsCollectionPageInfo.current,
          "pageSize": this.iconsCollectionPageInfo.pagesize,
          "type": 2
        }
        if(this.colorType === "2"){
          parames.iconColorType = "4"
        }else if(this.colorType === "3"){
          parames.iconColorType = "2"
        }else if(this.colorType === "4"){
          parames.iconColorType = "0,1"
        }
        if (this.searchName) parames.name = this.searchName
        iconList(parames).then(res => {
          res.data.forEach(item => {
            item.createTime = Moment(item.updated_at).format("YYYY-MM-DD HH:mm")
          })
          this.iconsCollection = res.data
          this.iconsCollectionPageInfo.total = res.count
          this.loading1 = false
          $(".el-main").scrollTop(0)
        }).catch(err => {
          console.log('错误', err)
          this.loading1 = false
        })
      },
      getIconsList(name){
        let parames = {
          "pageNum": this.pageInfo.current,
          "pageSize": this.pageInfo.pagesize
        }
        if (name) parames.name = name
        if(this.colorType === "2"){
          parames.iconColorType = "4"
        }else if(this.colorType === "3"){
          parames.iconColorType = "2"
        }else if(this.colorType === "4"){
          parames.iconColorType = "0,1"
        }
        this.loading = true
        iconList(parames).then(res => {
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
          this.tableData = data
          this.pageInfo.current = res.pageNum
          this.pageInfo.total = res.total
          this.loading = false
          $(".el-main").scrollTop(0)
        }).catch(err => {
          console.log('错误', err)
          this.loading = false
        })
      },
      querySearch(e){
        if(this.boxType === '1'){
          this.pageInfo.current = 1
          if(e === "click"){
            this.getIconsList(this.searchName)
          }else{
            let keyCode = window.event ? e.keyCode : e.which;
            if (keyCode == 13) {
              this.getIconsList(this.searchName)
            }
          }
        }else{
          this.iconsCollectionPageInfo.current = 1
          if(e === "click"){
            this.getIconsList2(this.searchName)
          }else{
            let keyCode = window.event ? e.keyCode : e.which;
            if (keyCode == 13) {
              this.getIconsList2(this.searchName)
            }
          }
        }
        
      },
      handleCurrentChange(val){
        this.pageInfo.current = val
        this.getIconsList(this.searchName)
      },
      upload(){
        if(!this.username){
            this.$refs.navigation.login()
        }else{
            this.$router.push("upload")
        }
      },
      openCollection(item){
        this.$router.push({
            name: 'detail',
            query: {
                collectionId: item.collectionId
            }
        })
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

.m-color-type{
    .el-radio-button__orig-radio:checked+.el-radio-button__inner{
        color: #000;
        background-color: #fff;
    }
}
.m-tab{
  .el-radio-button__inner{
    padding: 7px;
  }
}
</style>
<style lang="less" scoped>
.f-fr{
  float: right;
}
.f-fl{
  float: left;
}
.clearfix{
  overflow: hidden;
}
.mt5{
  margin-top: 5px;
}
.mt10{
  margin-top: 10px;
}
// .m-header-search{
//   z-index: 99999;
// }
.u-icons{
  display:inline-block;
  width: 158px;
  text-align: left;
  margin-left: 20px;
  font-size: 18px;
  color: #000;
  font-weight: bold;
}
  .home{
      margin-top: 114px;
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
      i{
        font-size: 18px;
      }
    }
  }
.m-color-type{
  position: absolute;
  display: inline-block;
  right: 20px;
  top: 20px;
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
      &:hover{
        color: #409EFF;
      }
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
  .m-page{
    margin-top: 20px;
    text-align: right;
  }

  .m-home-box-2{
      width: 1182px;
      // width: 1575px;
      margin: 0 auto;
  }

  .m-block-collection{
    padding: 15px;
    width: 316px;
    margin: 20px 33px 20px 12px;
    display: inline-block;
    .icon-wrap{
      width: 50px;
      height: 50px;
      text-align: center;
      line-height: 50px;
      color: #666;
      float: left;
      margin-top: 14px;
      margin-left: 11px;
    }
    .block-collection-icons{
      cursor: pointer;
    }
    .collection-info{
      overflow: hidden;
      height: 30px;
      line-height: 30px;
      text-align: left;
      font-size: 12px;
    }
    .userImg{
      vertical-align: middle;
    }
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
