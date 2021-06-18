<template>
<el-container style="height: 100%; border: 1px solid #eee">
  <el-container>
    <el-header style="text-align: right; font-size: 12px">
        <navigation></navigation>
    </el-header>
    <el-main class="home">
      
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import Navigation from './Navigation';

  export default {
    data() {
      return {
        activeIndex: '3',
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
</style>
