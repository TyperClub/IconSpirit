<template>
    <div>
        <div class="uploader-box">
            <div class="title">文件上传【图标资源】 <span class="size-limit">单文件限制：10MB </span>  <el-tag size="small">上传文件只支持 SVG ，尺寸限制为 1:1</el-tag></div>
            <div class="projects">
                <el-form class="m-form1" ref="form" :model="form" :rules="rules" label-position="left" label-width="80px" size="mini">
                    <el-form-item label="添加至" prop="CH_Name">
                        <el-radio v-model="radio2" label="1" border size="mini">我的上传</el-radio>
                        <el-radio v-model="radio2" label="2" border size="mini" disabled>图标库</el-radio>
                    </el-form-item>
                </el-form>
            </div>
            <div class="pack-layer">
                <div class="uploader-box-pack">
                    <div class="uploader-left f-fl">
                        <ul class="uploader-content"> 
                                <!-- <li class="icon-element active">
                                    <div>
                                        <svg class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="446" data-spm-anchor-id="a313x.7781069.1998910419.i2"><path d="M332.8 686.08c-20.48 0-35.84-15.36-35.84-35.84 0-5.12 0-76.8 56.32-107.52 15.36-10.24 25.6-10.24 30.72-10.24 5.12 0 10.24 0 25.6-10.24 20.48-5.12 30.72-10.24 35.84-15.36V486.4s-10.24-15.36-15.36-35.84c-10.24-5.12-10.24-20.48-10.24-30.72 0-15.36-5.12-30.72 5.12-40.96-5.12-15.36-5.12-25.6-5.12-35.84 5.12-30.72 35.84-71.68 92.16-71.68 61.44 0 87.04 40.96 92.16 76.8V384c10.24 5.12 5.12 20.48 5.12 35.84 0 10.24 0 25.6-15.36 35.84-5.12 20.48-10.24 30.72-20.48 40.96V512c5.12 5.12 20.48 10.24 35.84 15.36 15.36 5.12 20.48 10.24 25.6 10.24 10.24 0 15.36 5.12 30.72 10.24 56.32 30.72 61.44 102.4 61.44 107.52 0 10.24-5.12 20.48-10.24 25.6-5.12 5.12-15.36 10.24-25.6 10.24H332.8z m122.88-266.24c5.12 5.12 10.24 10.24 10.24 15.36 5.12 25.6 10.24 35.84 15.36 35.84 5.12 5.12 5.12 10.24 5.12 15.36v35.84c0 5.12-5.12 10.24-10.24 15.36 0 0-10.24 5.12-51.2 20.48-20.48 10.24-30.72 10.24-35.84 10.24-5.12 0-10.24 0-20.48 5.12-35.84 20.48-40.96 76.8-40.96 76.8h358.4s0-56.32-40.96-76.8c-15.36-5.12-15.36-5.12-20.48-10.24-5.12 0-15.36 0-35.84-10.24-40.96-15.36-51.2-20.48-51.2-20.48-5.12-5.12-10.24-10.24-10.24-15.36v-35.84c0-5.12 5.12-10.24 5.12-15.36 0 0 10.24-10.24 10.24-35.84 0-5.12 5.12-10.24 10.24-10.24h5.12v-20.48c5.12-5.12 0-10.24 5.12-15.36v-35.84c0-15.36-10.24-40.96-51.2-40.96-30.72 0-51.2 25.6-51.2 46.08 0 5.12 0 10.24 5.12 35.84 0 5.12 0 10.24-5.12 15.36v10.24c-5.12-5.12-5.12 5.12-5.12 5.12z" fill="#606266" p-id="447"></path><path d="M512 1024c-35.84 0-66.56-20.48-81.92-51.2-10.24-20.48-10.24-40.96 0-61.44l-215.04-128c-10.24 10.24-15.36 15.36-30.72 20.48-10.24 5.12-20.48 5.12-30.72 5.12-35.84 0-66.56-20.48-81.92-51.2-20.48-46.08 5.12-97.28 46.08-112.64 5.12 0 5.12 0 10.24-5.12V384c-5.12 0-5.12 0-10.24-5.12-25.6-10.24-40.96-25.6-51.2-46.08-10.24-20.48-10.24-46.08 0-66.56s25.6-35.84 46.08-46.08c10.24-5.12 20.48-5.12 30.72-5.12 25.6 0 46.08 10.24 61.44 25.6l215.04-128c-15.36-40.96 10.24-87.04 51.2-107.52C486.4 0 496.64 0 512 0c35.84 0 66.56 20.48 81.92 51.2 10.24 20.48 10.24 40.96 0 61.44l220.16 128c10.24-10.24 20.48-15.36 30.72-20.48 10.24-5.12 20.48-5.12 30.72-5.12 35.84 0 66.56 20.48 81.92 51.2 20.48 46.08-5.12 97.28-46.08 112.64-5.12 0-5.12 0-10.24 5.12v256c25.6 5.12 46.08 25.6 56.32 51.2 10.24 20.48 10.24 46.08 0 66.56s-25.6 35.84-46.08 46.08c-10.24 5.12-20.48 5.12-30.72 5.12-25.6 0-46.08-10.24-61.44-25.6l-220.16 128c15.36 40.96-5.12 92.16-51.2 107.52-15.36 5.12-25.6 5.12-35.84 5.12z m0-138.24c-5.12 0-15.36 0-20.48 5.12-5.12 5.12-15.36 5.12-15.36 10.24-5.12 5.12-5.12 10.24-10.24 15.36l-5.12 5.12c-5.12 10.24-5.12 20.48 0 35.84 10.24 20.48 25.6 30.72 46.08 30.72 5.12 0 15.36 0 20.48-5.12 25.6-10.24 35.84-35.84 30.72-61.44l5.12-5.12h-5.12c0-5.12-5.12-10.24-10.24-15.36-10.24-10.24-25.6-15.36-35.84-15.36z m-66.56-5.12c10.24-10.24 20.48-15.36 30.72-20.48 10.24-5.12 20.48-5.12 30.72-5.12 25.6 0 46.08 10.24 66.56 30.72l220.16-128c-5.12-20.48-5.12-40.96 0-61.44 10.24-20.48 25.6-35.84 46.08-46.08 5.12 0 15.36-5.12 20.48-5.12v-256c-30.72-5.12-56.32-25.6-66.56-51.2-10.24-20.48-10.24-40.96 0-61.44l-220.16-128c-10.24 10.24-20.48 15.36-30.72 20.48-10.24 5.12-20.48 5.12-30.72 5.12-25.6 0-51.2-10.24-66.56-30.72l-215.04 128c15.36 46.08-5.12 92.16-46.08 107.52-10.24 5.12-15.36 5.12-25.6 5.12v256c30.72 5.12 56.32 25.6 66.56 51.2 10.24 20.48 10.24 40.96 0 61.44l220.16 128z m430.08-204.8h-5.12c-5.12 0-10.24 0-10.24 5.12-25.6 10.24-35.84 35.84-30.72 61.44 5.12 10.24 5.12 15.36 10.24 20.48 10.24 10.24 20.48 15.36 35.84 15.36 5.12 0 15.36 0 20.48-5.12 10.24-5.12 20.48-15.36 25.6-25.6 5.12-10.24 5.12-25.6 0-40.96s-15.36-25.6-30.72-30.72h-15.36z m-727.04 0c-5.12 0-10.24 0-15.36 5.12-15.36 5.12-25.6 15.36-30.72 25.6-5.12 10.24-5.12 25.6 0 40.96 10.24 20.48 25.6 30.72 46.08 30.72 5.12 0 15.36 0 20.48-5.12 5.12 0 10.24-5.12 15.36-10.24 5.12-5.12 10.24-10.24 15.36-20.48 5.12-10.24 5.12-25.6 0-35.84-5.12-15.36-20.48-30.72-40.96-30.72h-10.24z m727.04-424.96c-5.12 0-15.36 0-20.48 5.12-5.12 0-10.24 5.12-15.36 10.24-5.12 5.12-10.24 10.24-10.24 15.36-5.12 15.36-5.12 25.6 0 40.96s20.48 30.72 40.96 30.72h5.12c5.12 0 10.24 0 15.36-5.12 30.72-10.24 40.96-40.96 30.72-66.56-10.24-20.48-25.6-30.72-46.08-30.72z m-727.04 0c-5.12 0-15.36 0-20.48 5.12-10.24 0-20.48 10.24-25.6 25.6-5.12 10.24-5.12 25.6 0 35.84 5.12 10.24 15.36 20.48 25.6 25.6 5.12 5.12 15.36 5.12 20.48 5.12h5.12c5.12 0 10.24 0 15.36-5.12 25.6-5.12 35.84-35.84 25.6-61.44 0-10.24-5.12-15.36-10.24-20.48-5.12-5.12-10.24-5.12-15.36-10.24h-20.48zM512 35.84c-5.12 0-15.36 0-20.48 5.12-25.6 10.24-35.84 35.84-30.72 61.44 5.12 10.24 5.12 15.36 10.24 20.48 10.24 10.24 25.6 15.36 40.96 15.36 5.12 0 15.36 0 20.48-5.12 5.12-5.12 10.24-5.12 15.36-10.24 5.12-5.12 10.24-10.24 10.24-20.48 5.12-10.24 5.12-25.6 0-35.84-10.24-20.48-25.6-30.72-46.08-30.72z" fill="#606266" p-id="448"></path></svg>
                                    </div>
                                    <div class="icon-name">
                                        ops-asdf
                                    </div>
                                </li> -->
                                <li class="icon-element" v-for="(item, index) in fileList" :key="index">
                                    <div>
                                        <img style="width: 32px; height: 32px;" :src="item.imageUrl" alt="">
                                    </div>
                                    <div class="icon-name">
                                        {{item.name}}
                                    </div>
                                </li>
                                <li>
                                    <el-upload
                                        action="https://jsonplaceholder.typicode.com/posts/"
                                        name="file"
                                        :show-file-list="false"
                                        :file-list="fileList"
                                        :before-upload="beforeUploadFile"
                                        :on-progress="uploadFileProcess"
                                        :on-success="handleFileSuccess"
                                    >
                                        <div class="add-icons">
                                            <i class="el-icon-plus"></i>
                                        </div>
                                    </el-upload>
                                </li>
                            <!-- <div class="uploader-content-default">暂无数据</div> -->
                        </ul>
                    </div>
                    <div class="uploader-right f-fl" v-if="fileList.length">
                        <el-form class="m-form2" ref="form" :model="form" :rules="rules" label-width="140px">
                            <el-form-item label="图标中文名称" prop="CH_Name">
                                <el-input class="u-input-text" size="small" v-model="form.CH_Name" clearable></el-input>
                            </el-form-item>
                            <el-form-item class="u-form-item" label="图标分组" prop="ENG_Name">
                                <el-input class="u-input-text" disabled size="small" v-model="form.ENG_Name" clearable></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
            <div class="btn-uploader-group">
                <el-button type="primary">上传</el-button>
                <el-button @click="close">关闭</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            radio2: "1",
            fileList: [],
            form: {
                CH_Name: "",
                ENG_Name: "默认",
                gurop: ""
            }
        }
    },
    methods: {
        beforeUploadFile(file, fileList) {
            console.log(file, fileList);
        },
        uploadFileProcess(file) {
             console.log(file);
        },
        handleFileSuccess(res, file,fileList){
            console.log(1111, res, file,fileList)
            this.fileList = fileList
            this.fileList.forEach(item =>{
                item.imageUrl = URL.createObjectURL(file.raw)
            })
        },
        close(){
            this.$router.go(-1);
        }
    }
}
</script>

<style lang="less">
.u-input-text input{
    color: #333;
    background-color: #f8f9fa;
    border-color: #f8f9fa;
}
.el-upload-list--picture-card .el-upload-list__item-status-label{
    background: #409EFF;
}
.m-form1{
    .el-form-item{
        margin-bottom: 0px;
    }
}
.u-form-item{
     margin-bottom: 0px;
}
</style>

<style lang="less" scoped>
.f-fl{
    float: left;
}
.uploader-box{
    width: 900px;
    margin: 78px auto 0;
}
.btn-uploader-group{
    margin-top: 20px;
}
.title{
    margin-bottom: 20px;
}
.size-limit{
    color: #4f9ff9;
    border: 1px solid;
    font-size: 13px;
    padding: 3px 5px;
    margin-right: 10px;
    border-radius: 3px;
}
.support-file{
    background: #fdfdfd;
    padding: 10px 10px;
    margin-bottom: 20px;
    font-size: 12px;
    color: #333;
    border: 1px solid #ebebeb;
}
.projects{
    padding: 12px 20px;
    border: 1px solid #e6e6e6;
    box-shadow: 0 1px 2px #e3e9f3;
    border-radius: 5px;
    margin-bottom: 20px;
}

.uploader-content{
    .icon-element{
        width: 96px;
        height: 80px;
        padding-top: 14px;
        overflow: hidden;
        text-align: center;
        border: 1px solid #eaeaea;
        border-radius: 5px;
        cursor: pointer;
        &.active{
            border: 1px solid #4f9ff9;
        }
    }
    .add-icons{
        width: 96px;
        height: 94px;
        line-height: 102px;
        text-align: center;
        background: #fbfdff;
        border-radius: 5px;
        border: 1px dashed #c0ccda;
        i{
            font-size: 30px;
            color: #8c939d;
        }
        &:hover{
            border-color: #409EFF;
        }
    }
    .icon-name{
        margin-top: 5px;
        line-height: 22px;
        color: #000;
        padding: 0 10px;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    li{
        float: left;
        margin-bottom: 10px;
        margin-right: 20px;
    }
}


.pack-layer{
    padding: 20px;
    border-radius: 5px;
    border: 1px solid #e6e6e6;
    box-shadow: 0 2px 4px #e3e9f3;
    background: #ffffff;
}

.uploader-box-pack{
    overflow: hidden;
    .uploader-left{
        width: 480px;
    }
}
</style>