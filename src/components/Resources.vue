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
                <div class="tool">
                    <b>我上传的 icon</b>
                    <span>{{myUpload.icons.length}} 个图标</span>
                    <span class="u-public" v-if="myUpload.icons.length">
                        <el-radio class="u-public-radio" v-model="radio" label="1">图标开放</el-radio>
                        <el-radio v-model="radio" label="2">图标私有</el-radio>
                    </span>
                </div>
                <icons v-show="myUpload && myUpload.icons" :projectList="myUpload" :tabPosition="tabPosition" type="myUploadIcons" @newGetProjects="getMyUploadIcons" @addIcons="addIcons"></icons>
                <div class="m-icons-default"  v-if="myUpload && myUpload.icons.length === 0">
                    <div>
                        <img src="https://img.alicdn.com/tfs/TB1PhV7uoY1gK0jSZFMXXaWcVXa-164-142.svg">
                    </div>
                    <p>暂时木有内容呀～～</p>
                </div>
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
import { myUploadIcons } from '../services/index'
import Icons from "./Icons"

export default {
    data(){
        return {
            radio: "1", 
            active: 1,
            myUpload: {
                prefix: "",
                icons: []
            }
        }
    },
    mounted(){
        this.getMyUploadIcons()
    },
    methods: {
        getMyUploadIcons(){
            myUploadIcons().then(res => {
                if(res.code === 200){
                    this.myUpload.icons = res.data
                }
            })
        },
        addIcons(type, item){
            this.$emit('addIcons', type, item)
        },
        deleteSelectIcon(type, item){
            this.myUpload.icons.forEach(obj =>{
                if(type == "all"){
                    obj.status = false
                }else{
                    if(obj.id == item.id){
                        obj.status = false
                    }
                }
            })
        }
    },
    components: {
        Icons
    }
}
</script>

<style lang="less">
.u-public span{
    color: #999;
}
.u-public-radio{
    margin-right: 20px;
}
</style>

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
    .tool{
        margin-bottom: 25px;
        b{
            font-size: 24px;
        }
        span{
            font-size: 14px;
            color: #999;
            margin-left: 20px;
        }
    }
}
.m-icons-default{
    padding-top: 50px;
    text-align: center;
    color: #666;
    p{
        padding-top: 15px;
    }
}
.u-public{
    padding-left: 10px;
}
</style>