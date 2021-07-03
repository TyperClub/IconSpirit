<template>
     <div>
        <el-steps class="m-steps" :active="1" simple>
            <el-step title="迁移信息"></el-step>
            <el-step title="项目信息"></el-step>
        </el-steps>
        <div v-show="active == 1">
            <el-form  :model="form2" :rules="rules2" ref="form2"  label-width="115px">
                <el-form-item label="地址" prop="url">
                    <el-input style="width: 280px" v-model="form2.url" placeholder="请输入 iconfont css 链接地址" clearable></el-input>
                    <a class="u-link" href="https://www.iconfont.cn/" target="_blank">打开 iconfont 复制链接</a>
                </el-form-item>
            </el-form>
            <div class="btn-wrap first">
                <el-button type="primary" @click="next('form2')">下一步</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { fontTransfer } from '../services/index';

export default {
    data(){
        return{
            active: 1,
            form2: {
                url: "//at.alicdn.com/t/font_2627940_flbnyr7meh.ttf?t=1625298507664"
            },
            rules2: {
                url: [{ required: true, message: '请输入 iconfont css 链接地址', trigger: 'blur' }],
            }
        }
    },
    methods:{
        next(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    fontTransfer({
                        url: this.form2.url
                    }).then(res =>{
                        console.log(111,res)
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
</style>