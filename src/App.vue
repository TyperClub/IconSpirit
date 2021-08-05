<template>
    <router-view class="router-view" v-slot="{ Component }">
        <component :is="Component" />
    </router-view>
</template>

<script>
  export default {

  }
</script>

<style lang="less">
*{
  margin: 0;
  padding: 0;
}
li{
  list-style-type:none;
}
html, body {
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  font-family: Helvetica, Arial, "Hiragino Sans GB", "Microsoft Yahei", "\5FAE\8F6F\96C5\9ED1", STHeiti, "\534E\6587\7EC6\9ED1", sans-serif;
}
#app {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}
::-webkit-scrollbar-thumb {
    background-color: #e6e6e6;
    min-height: 25px;
    min-width: 25px;
    border: 1px solid #e0e0e0
}

::-webkit-scrollbar-track {
    background-color: #f7f7f7;
    border: 1px solid #efefef
}
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    overflow: auto
}
.router-view{
    width: 100%;
    height: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: 0 auto;
    -webkit-overflow-scrolling: touch;
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
  }
.icon {
  font-size: 36px;
  color: #666;
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}
@media screen and (max-width: 1250px) {
    .m-nav-search{
      display: none;
    }
}

@media screen and (max-width: 990px) {
    .u-menu-nav{
      display: none;
    }
}
</style>