<template>
    <div>
        <div class="m-project-box">
                <div class="m-project">
                <div class="u-project">
                    <div><i class="opsfont ops-document-box"></i><span class="project-title">我的上传</span></div>
                </div>
                <div class="u-project">
                    <div><i class="opsfont ops-shoucang"></i><span class="project-title">我的收藏</span></div>
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
    .project-title{
        padding-left: 3px;
    }
    .project-list{
        margin-top: 12px;
        .item{
            padding-left: 18px;
            font-size: 12px;
            height: 35px;
            line-height: 35px;
            white-space: nowrap;
            width: 90px;
            overflow: hidden;
            color: #999;
            cursor: pointer;
            text-overflow: ellipsis;
        }
        .item :hover {
            color: #333;
        }
        .current{
            position: relative;
            color: #333;
            &:before{
                content: '';
                position: absolute;
                left: 3px;
                top: 50%;
                margin-top: -.5em;
                height: 1em;
                width: 2px;
                border-radius: 2px;
                background-color: #409EFF;
            }
        }
    }
}
</style>