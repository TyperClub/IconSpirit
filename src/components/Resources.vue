<template>
    <div>
        <div class="m-project-box">
                <div class="m-project">
                <div class="u-project" :class="active == 1 ? 'active' : ''" @click="active = 1">
                    <div><i class="opsfont ops-document-box"></i><span class="project-title"> 我的上传</span></div>
                </div>
                <div class="u-project" :class="active == 2 ? 'active' : ''" @click="active = 2">
                    <div><i class="opsfont ops-shoucang"></i><span class="project-title"> 我的收藏</span></div>
                </div>
                <!-- <div class="u-project" :class="active == 3 ? 'active' : ''" @click="active = 3">
                    <div><i class="opsfont ops-document-box"></i><span class="project-title"> 我的图标库</span></div>
                </div> -->
            </div>
            <div class="m-project-tool" v-if="active == 1">
                我的上传
            </div>
            <div class="m-project-tool" v-if="active == 2">
                我的收藏
            </div>
            <div class="m-project-tool" v-if="active == 3">
                我的收藏
            </div>
        </div> 
    </div>
</template>

<script>
export default {
    data(){
        return {
            active: 1
        }
    },
    methods: {
    }
}
</script>

<style lang="less" scoped>
.m-project-box{
    display: flex;
    padding: 10px 0 15px;
    min-height: 340px;
}
.m-project{
    width: 200px;
    border-right: 1px solid #ccc;
}

.u-project{
    font-size: 14px;
    color: #999;
    margin-bottom: 25px;
    cursor: pointer;
    &.active{
        color: #409EFF;
    }
}
.m-project-tool{
    position: relative;
    width: 100%;
    padding-left: 20px;
}
</style>