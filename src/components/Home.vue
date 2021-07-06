<template>
    <el-container style="height: 100%;">
        <el-header style="text-align: right; font-size: 12px">
            <navigation ref="navigation" @deleteSelectIcon="deleteSelectIcon"></navigation>
        </el-header>
    <div class="home">
        <div class="m-logo">掌门 ICONS</div>
        <!-- <div>今日新增：2 Icons</div> -->
        <!-- <img width="500" src="../assets/sheji.png" alt=""> -->
    </div>
    </el-container>
</template>

<script>
import Navigation from './Navigation';
export default {
    components:{
        Navigation
    }
}
</script>

<style lang="less" scoped>
.m-logo{
    padding-top: 200px;
}
</style>