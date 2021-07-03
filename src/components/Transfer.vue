<template>
     <div>
        <el-form  :model="form2" :rules="rules2" ref="form2"  label-width="115px">
            <el-form-item label="项目名称" prop="name">
                <el-input style="width: 438px" v-model="form2.name" placeholder="请输入项目名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="url">
                <el-input style="width: 330px" v-model="form2.url" placeholder="请输入 iconfont css 链接地址" clearable></el-input>
                <!-- <a class="u-link" href="https://www.iconfont.cn/" target="_blank">打开 iconfont 复制链接</a> -->
                <el-button class="transfer-btn" type="primary" @click="next('form2')">一键迁移</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { fontTransfer } from '../services/index';

export default {
    data(){
        return{
            active: 1,
            form2: {
                name: "",
                url: "https://at.alicdn.com/t/font_1246635_1rd1nwr9kqp.css"
            },
            rules2: {
                name: [{ required: true, message: '请输入项目名', trigger: 'blur' }],
                url: [{ required: true, message: '请输入 iconfont css 链接地址', trigger: 'blur' }],
            }
        }
    },
    methods:{
        next(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    fontTransfer(this.form2).then(() =>{
                        this.$message.success("迁移成功！")
                        this.$emit('closeTransfer')
                    })
                }else{
                    return false;
                }
            })
        },
    }
}
</script>

<style lang="less">
.m-transferBox .el-dialog__body{
    padding-top: 0px;
}
</style>

<style lang="less" scoped>


.m-steps{
    margin-bottom: 20px;
}
.btn-wrap {
  margin: 35px 0 -10px;
  display: flex;
  justify-content: space-between;
  &.first {
    text-align: right;
    display: block;
  }
}
.u-link{
    padding-left: 10px;
    text-decoration: none;
    font-size: 12px;
    color: #666;
    &:hover{
        color: #409EFF;
    }
}
.transfer-btn{
    margin-left: 10px;
}
</style>