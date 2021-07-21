<template>
    <div>
        <div class="m-project-box">
                <div class="m-project">
                <div class="u-project active">
                    <div><i class="opsfont ops-document-box"></i><span class="project-title"> 我的上传</span></div>
                </div>
                <div class="u-project">
                    <div><i class="opsfont ops-shoucang"></i><span class="project-title"> 我的收藏</span></div>
                </div>
            </div>
            <div class="m-project-tool">
                我的上传
            </div>
        </div> 
    </div>
</template>

<script>
export default {
    
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