<template>
    <div>
        <div class="uploader-box">
            <div class="title">文件上传【图标资源】 <span class="size-limit">单文件限制：10MB </span> <el-tag size="small">上传文件只支持 SVG ，尺寸限制为 1:1</el-tag></div>
            <div class="projects">
                <el-form class="m-form1" ref="form1" label-position="left" label-width="80px" size="mini">
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
                                <li 
                                    class="icon-element" 
                                    :class="index === iconsIndex ? 'active' : ''" 
                                    v-for="(item, index) in fileList" :key="index" 
                                    @click="rowIcon(index)"
                                >
                                    <span class="icon-close" @click.stop="deleteIcon(index)"><i class="el-icon-close"></i></span>
                                    <div>
                                        <img style="width: 32px; height: 32px;" :src="item.imageUrl" alt="">
                                    </div>
                                    <div class="icon-name">
                                        {{item.CH_Name}}
                                    </div>
                                </li>
                                <li>
                                    <el-upload
                                        :action="uploadUrl"
                                        :auto-upload="false"
                                        name="file"
                                        :show-file-list="false"
                                        :file-list="fileList"
                                        :on-change="addUploadFile"
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
                            <el-form-item class="u-form-item" label="图标英文名称" prop="ENG_Name">
                                <el-input class="u-input-text" size="small" v-model="form.ENG_Name" clearable></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
            <div class="btn-uploader-group">
                <el-button type="primary" @click="submitUpload">上传</el-button>
                <el-button @click="close">关闭</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            uploadUrl: "",
            radio2: "1",
            iconsIndex: 0,
            fileList: [],
            form: {
                CH_Name: "",
                ENG_Name: ""
            },
            rules: {
                CH_Name:  [{ required: true, message: '请输入图标中文名称', trigger: 'blur' }],
                ENG_Name:  [{ required: true, message: '请输入图标英文名称', trigger: 'blur' }],
            }
        }
    },
    watch: {
        form:{
            immediate:true,
            deep: true,
            handler:function(data){
                if(this.fileList.length){
                    this.fileList[this.iconsIndex].CH_Name = data.CH_Name
                    this.fileList[this.iconsIndex].ENG_Name = data.ENG_Name
                }
            }
        }
    },
    methods: {
        addUploadFile(file) {
            const isJPG = file.raw.type === 'image/svg+xml';
            const isLt2M = file.raw.size / 1024 / 1024 < 10;

            if (!isJPG) {
                this.$message.error('上传图标只能是 SVG 格式!');
                return
            }
            if (!isLt2M) {
                this.$message.error('上传图标大小不能超过 10MB!');
                return
            }
            file.imageUrl = URL.createObjectURL(file.raw)
            let fileName = file.name.split(".svg")[0]
            if(!this.fileList.length){
                this.form = {
                    CH_Name: fileName,
                    ENG_Name: fileName
                }
                this.iconsIndex = 0
            }
            file.CH_Name = fileName
            file.ENG_Name = fileName
            this.fileList.push(file)
        },
        uploadFileProcess() {
            //  console.log(file);
        },
        handleFileSuccess(){
            // console.log(1111, res, file,fileList)
            // this.fileList = fileList
            // this.fileList.forEach(item =>{
            //     item.imageUrl = URL.createObjectURL(file.raw)
            // })
        },
        rowIcon(index){
            this.iconsIndex = index
            this.form = {
                CH_Name: this.fileList[index].CH_Name,
                ENG_Name: this.fileList[index].ENG_Name
            }
        },
        deleteIcon(index){
            this.fileList.splice(index,1)
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
    overflow: hidden;
    .icon-element{
        position: relative;
        width: 96px;
        height: 80px;
        padding-top: 14px;
        overflow: hidden;
        text-align: center;
        border: 1px solid #eaeaea;
        border-radius: 5px;
        cursor: pointer;
        .icon-close{
            position: absolute;
            display: none;
            top: 5px;
            right: 7px;
        }
        &.active{
            border: 1px solid #4f9ff9;
        }
        &:hover .icon-close{
            display: block;
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
    padding: 20px 20px 10px 20px;
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