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
                    <span @click="upload" class="tool-1"><i class="opsfont ops-document-box"></i> 上传图标</span>
                    <el-radio-group class="u-public" v-model="radio" @change="changePublic">
                        <el-radio class="u-public-radio" label="1">开放图标</el-radio>
                        <el-radio label="2">私有图标</el-radio>
                    </el-radio-group>
                </div>
                <div v-loading="loading">
                    <icons v-show="myUpload && myUpload.icons" :projectList="myUpload" :tabPosition="tabPosition" type="myUploadIcons" @newGetProjects="getMyUploadIcons" @addIcons="addIcons"></icons>
                    <div class="m-icons-default"  v-if="myUpload && myUpload.icons.length === 0">
                        <div>
                            <img src="https://img.alicdn.com/tfs/TB1PhV7uoY1gK0jSZFMXXaWcVXa-164-142.svg">
                        </div>
                        <p>暂时木有内容呀～～</p>
                    </div>
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
import { myUploadIcons, publicIcons } from '../services/index'
import Icons from "./Icons"

export default {
    data(){
        return {
            radio: "1",
            loading: false,
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
            this.loading = true
            myUploadIcons().then(res => {
                if(res.code === 200){
                    if(res.data.length){
                        this.radio = res.data[0].public === true ? "1" : "2"
                    }
                    this.myUpload.icons = res.data
                }
                this.loading = false
            }).catch(e => {
                this.loading = false
                console.log(e)
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
        },
        changePublic(){
            publicIcons({
                status: this.radio === "1" ? true : false
            }).then(res => {
                if(res.code === 200){
                    if(this.radio === "1"){
                        this.$message.success("图标已开放成功！将会被搜索到！")
                    }else{
                        this.$message.success("图标已私有成功！将不会被搜索到！")
                    }
                }
            })
        },
        upload(){
            this.$router.push("upload")
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
        .tool-1{
            cursor: pointer;
            &:hover{
                color: #409EFF;
            }
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
    padding-left: 30px;
}
</style>